// The survey link we print everywhere (ryandsouza.org/survey) is permanent;
// the form behind it can change. Keep permanent: false so browsers and
// platforms never cache the destination.
const SURVEY_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfYd_8amsBUjEgmv0GvZBmLzE5mbp5duaVDoS0mehw-zAJJEw/viewform'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/survey', destination: SURVEY_FORM_URL, permanent: false },
    ]
  },
}

module.exports = nextConfig
