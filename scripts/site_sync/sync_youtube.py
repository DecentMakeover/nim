#!/usr/bin/env python3
"""Write the site's episode and Blueprint lists from YouTube.

YouTube is the source of truth, so the site cannot drift from what is actually
published: a new upload appears, and a video made private or deleted disappears.

    sync_youtube.py --token <youtube_token.json> --out app/data

Only public, processed videos are ever written. The Blueprint token owns that
channel, so its listing includes private and scheduled uploads; is_live() is what
keeps them off the site, and sanity_check() refuses a suspicious drop in the list.
Stdlib only, so it runs under any python3 on the Air.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

PODCAST_CHANNEL = 'UCwhKRU-241r-1anKt2matDA'  # @decentmakeover
BLUEPRINT_CHANNEL = 'UCI-OsPO5r1-dcJL0OO9Ehcw'  # @theblueprintuncut
API = 'https://www.googleapis.com/youtube/v3/'
HERE = Path(__file__).resolve().parent

# Episode topics are the channel's own playlists: add an episode to one on YouTube
# and the site follows. Order here is display order.
TOPICS = [
    ('ai', 'AI & Technology'),
    ('india', 'India, Economy & Work'),
    ('startups', 'Startups, Business & Investing'),
    ('culture', 'Culture, Philosophy & Ethics'),
]
START_HERE_PLAYLIST = 'Start Here'

# Fallback for an episode that is in no topic playlist yet, which is every new one
# until someone files it. Matched against the title only: descriptions name-drop.
TOPIC_RULES = {
    'ai': r'\bAI\b|artificial intelligence|machine learning|\bLLMs?\b|semiconductor|\bchips?\b|software|robot|deep tech',
    'india': r'\bIndia|econom|\bjobs?\b|\bwages?\b|migration|\bH-?1B\b|policy|Bangalore|Bengaluru|\bcit(y|ies)\b',
    'startups': r'startup|founder|\bCEO\b|venture|\bVC\b|investing|investor|\bfund|SaaS|\bARR\b|\bIPOs?\b|\bESOPs?\b|fintech',
    'culture': r'philosoph|ethic|cultur|religio|histor|dowry|caste|film|cinema|\bbooks?\b|myth|chess|attention|society',
}

# Blueprint themes: first match wins, so the specific ones come first. Matched on
# the title, then on the description if the title says nothing.
THEMES = [
    ('ai', 'AI at work', r'\bAI\b(?! engineer)|ChatGPT|Claude|Gemini|Copilot|automation|artificial intelligence|\bLLMs?\b'),
    ('money', 'Salaries & money', r'salar|\bLPA\b|\bCTC\b|\bhikes?\b|\bpackage\b|in bank\b|\bpay\b|\bpaid\b|earning|earned|lakh|\bcrore|\b\d+\s?(cr|L|K)\b|₹|saving|invest|expens|money|\brent\b|budget|\btax\b|\bspends?\b|\bcost|\bafford|financ(e|ial) (goal|plan|advice)|\bloan|\bEMI\b|\bbonus|net worth|most expensive|buy'),
    ('hiring', 'Getting hired', r'interview|placement|\bhired?\b|hiring|job (hunt|search|switch|offer|portal)|switch(ing|ed)? (job|compan|role)|naukri|resume|\bCV\b|referral|recruit|\bfreshers?\b|first job|internship|\bintern\b|\d+ applications|campus|\bDSA\b|\brounds?\b|linkedin'),
    ('college', 'College & degrees', r'college|universit|\bIITs?\b|\bIIMs?\b|\bNITs?\b|\bIISc\b|\bMBA\b|\bBBA\b|B\.?Tech|B\.?Com|degree|master|school|education|certification|course|alum|parents spent'),
    ('life', 'Life outside work', r'work.?life|balance|vacation|holiday|leaves?\b|weekend|hobb|parent|\bbaby|\bkids?\b|mom\b|mother|father|\bdad\b|marri|wedding|relationship|family|traffic|moved|moving to|mental health|stress|burnout|screen time|gym|fitness|\bdog\b|travel|\bsleep|commut|work from home|\bWFH\b|hybrid|\bbooks?\b|fashion|shopping|dating'),
    ('work', 'The job itself', r'what (does|do|is)|day in|daily|\bwork(s|ing)?\b|\brole\b|manager|engineer|analyst|developer|consultant|career|promotion|skills?\b|how to become|advice|corporate|company|companies|team|\bjobs?\b|\bboss\b|culture|growth|business|mistake|laid off|layoff|data science|\bCA\b'),
]
COMPILATION = ('compilations', 'Compilations')
OTHER = ('other', 'More')
SHORT_MAX_S = 180  # a Blueprint upload past this is a compilation, not a Short
MAX_DROP = 0.2  # refuse to publish if a list shrinks by more than this in one run


def get_access_token(token_file: Path) -> str:
    d = json.loads(token_file.read_text())
    body = urllib.parse.urlencode({
        'client_id': d['client_id'],
        'client_secret': d['client_secret'],
        'refresh_token': d['refresh_token'],
        'grant_type': 'refresh_token',
    }).encode()
    with urllib.request.urlopen(urllib.request.Request(d['token_uri'], body), timeout=30) as r:
        return json.load(r)['access_token']


class YouTube:
    def __init__(self, access_token: str):
        self.headers = {'Authorization': f'Bearer {access_token}'}

    def get(self, path: str, **params) -> dict:
        url = API + path + '?' + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers=self.headers)
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)

    def pages(self, path: str, **params):
        token = None
        while True:
            kw = dict(params, maxResults=50)
            if token:
                kw['pageToken'] = token
            r = self.get(path, **kw)
            yield from r.get('items', [])
            token = r.get('nextPageToken')
            if not token:
                return

    def playlist_ids(self, playlist: str) -> list[str]:
        return [i['contentDetails']['videoId']
                for i in self.pages('playlistItems', part='contentDetails', playlistId=playlist)]

    def channel_videos(self, channel: str) -> list[dict]:
        ch = self.get('channels', part='contentDetails', id=channel)['items'][0]
        ids = self.playlist_ids(ch['contentDetails']['relatedPlaylists']['uploads'])
        videos = []
        for i in range(0, len(ids), 50):
            r = self.get('videos', part='snippet,contentDetails,status', id=','.join(ids[i:i + 50]))
            videos += r.get('items', [])
        return videos

    def channel_playlists(self, channel: str) -> dict[str, str]:
        return {p['snippet']['title']: p['id']
                for p in self.pages('playlists', part='snippet', channelId=channel)}


def is_live(v: dict) -> bool:
    s = v['status']
    return s.get('privacyStatus') == 'public' and s.get('uploadStatus') == 'processed'


def seconds(iso: str) -> int:
    m = re.fullmatch(r'P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso)
    d, h, mi, s = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def tidy(text: str) -> str:
    text = re.sub(r'\s+', ' ', text).strip()
    return re.sub(r'\s+([,:])', r'\1', text)


def parse_title(raw: str) -> dict:
    """Split the house format 'Question? | Guest, Org' into its parts.

    Older titles are irregular; those are pinned in episode_curation.json. Anything
    else shows its full title with no guest, which is plain but never wrong.
    """
    raw = tidy(re.sub(r'^#\d+\s*', '', raw))
    if raw.count(' | ') == 1:
        title, right = raw.split(' | ')
        on = re.match(r'(?:Prof\.?\s+)?(.+?) on .+', right)
        if on:
            return {'title': title, 'guest': on.group(1), 'detail': None}
        guest, _, detail = re.sub(r'^Prof\.?\s+', '', right).partition(', ')
        if len(guest.split()) <= 5:
            return {'title': title, 'guest': guest, 'detail': detail or None}
    return {'title': raw, 'guest': None, 'detail': None}


def build_podcast(yt: YouTube, curation: dict) -> dict:
    playlists = yt.channel_playlists(PODCAST_CHANNEL)
    members = {slug: set(yt.playlist_ids(playlists[name]))
               for slug, name in TOPICS if name in playlists}
    start_here = yt.playlist_ids(playlists[START_HERE_PLAYLIST]) if START_HERE_PLAYLIST in playlists else []

    episodes = []
    for v in yt.channel_videos(PODCAST_CHANNEL):
        if not is_live(v):
            continue
        vid, raw = v['id'], v['snippet']['title']
        pinned = curation.get(vid, {})
        parsed = parse_title(raw)
        topics = [slug for slug, _ in TOPICS
                  if vid in members.get(slug, ()) or slug in pinned.get('topics', ())]
        if not topics:
            topics = [slug for slug, _ in TOPICS if re.search(TOPIC_RULES[slug], raw, re.I)]
        episodes.append({
            'id': vid,
            'title': pinned.get('title', parsed['title']),
            'guest': pinned.get('guest', parsed['guest']),
            # A pinned guest means the title did not parse, so nothing else from it is trusted.
            'detail': pinned.get('detail', None if 'guest' in pinned else parsed['detail']),
            'published': v['snippet']['publishedAt'][:10],
            'minutes': round(seconds(v['contentDetails']['duration']) / 60),
            'topics': topics,
        })
    episodes.sort(key=lambda e: (e['published'], e['id']), reverse=True)
    live = {e['id'] for e in episodes}
    return {
        'topics': [{'slug': s, 'name': n, 'count': sum(s in e['topics'] for e in episodes)}
                   for s, n in TOPICS],
        'start_here': [i for i in start_here if i in live],
        'episodes': episodes,
    }


def classify(title: str, description: str) -> str:
    for text in (title, description):
        for slug, _, pattern in THEMES:
            if re.search(pattern, text, re.I):
                return slug
    return OTHER[0]


def build_blueprint(yt: YouTube) -> dict:
    videos, seen = [], set()
    rows = sorted((v for v in yt.channel_videos(BLUEPRINT_CHANNEL) if is_live(v)),
                  key=lambda v: (v['snippet']['publishedAt'], v['id']), reverse=True)
    for v in rows:
        title = tidy(v['snippet']['title'])
        if title.lower() in seen:  # the same clip uploaded twice: keep the newest
            continue
        seen.add(title.lower())
        secs = seconds(v['contentDetails']['duration'])
        description = v['snippet']['description'].split('\n\n')[0]
        videos.append({
            'id': v['id'],
            'title': title,
            'published': v['snippet']['publishedAt'][:10],
            'seconds': secs,
            'theme': COMPILATION[0] if secs > SHORT_MAX_S else classify(title, description),
        })
    names = [COMPILATION] + [(s, n) for s, n, _ in THEMES] + [OTHER]
    themes = [{'slug': s, 'name': n, 'count': sum(x['theme'] == s for x in videos)} for s, n in names]
    return {'themes': [t for t in themes if t['count']], 'videos': videos}


def sanity_check(path: Path, key: str, new: dict) -> None:
    """Keep the last good list rather than publish a hollowed-out one."""
    if not new[key]:
        sys.exit(f'REFUSING: YouTube returned no {key}')
    if path.exists():
        old = len(json.loads(path.read_text())[key])
        if len(new[key]) < old * (1 - MAX_DROP):
            sys.exit(f'REFUSING: {key} fell from {old} to {len(new[key])}; check the channel, then delete {path.name} to accept')


def write_if_changed(path: Path, data: dict) -> bool:
    text = json.dumps(data, ensure_ascii=False, indent=1) + '\n'
    if path.exists() and path.read_text() == text:
        return False
    path.write_text(text)
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--token', type=Path, required=True)
    ap.add_argument('--out', type=Path, required=True)
    a = ap.parse_args()

    yt = YouTube(get_access_token(a.token))
    curation = json.loads((HERE / 'episode_curation.json').read_text())
    podcast, blueprint = build_podcast(yt, curation), build_blueprint(yt)
    sanity_check(a.out / 'podcast.json', 'episodes', podcast)
    sanity_check(a.out / 'blueprint.json', 'videos', blueprint)
    a.out.mkdir(parents=True, exist_ok=True)
    changed = [write_if_changed(a.out / 'podcast.json', podcast),
               write_if_changed(a.out / 'blueprint.json', blueprint)]
    print(f"{dt.datetime.now():%F %T} episodes={len(podcast['episodes'])} "
          f"blueprint={len(blueprint['videos'])} changed={any(changed)}")


if __name__ == '__main__':
    try:
        main()
    except urllib.error.HTTPError as e:
        sys.exit(f'YouTube API error {e.code}: {e.read()[:300].decode(errors="replace")}')
