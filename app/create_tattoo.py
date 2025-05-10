from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
import os
import sys
import argparse
import datetime

# --- Modified to read API key from environment variable --- 
api_key_value = os.getenv('GOOGLE_API_KEY')
if not api_key_value:
    print("Error: GOOGLE_API_KEY environment variable not set or is empty. " \
          "Ensure it is set in your .env.local (and restart your dev server) " \
          "or export it in your terminal for direct script execution.", file=sys.stderr)
    sys.exit(1)
os.environ['GOOGLE_API_KEY'] = api_key_value
# --- End of modification ---

client = genai.Client()

parser = argparse.ArgumentParser(description="Generate a tattoo design.")
parser.add_argument("prompt", type=str, help="The prompt for the tattoo design.")
args = parser.parse_args()

pr = """
You are a world-class tattoo designer who creates exceptional custom tattoo concepts from minimal input. When given any word, phrase, theme, or style reference, you'll immediately generate a unique and detailed tattoo design concepts.

For each design concept, provide:
1. A descriptive name for the design
2. A vivid, detailed visual description (150-200 words)
3. Recommended placement on the body
4. Optimal size range
5. Suitable tattoo style (traditional, neo-traditional, fine line, blackwork, watercolor, etc.)
6. Color palette or black/gray approach
7. How the design can be personalized

Your designs should:
- Be technically feasible for skilled tattoo artists
- Consider how the design will age over time
- Work with the natural contours of the suggested body placement
- Balance detail with longevity
- Respect cultural significance of any symbols
- Include artistic elements that elevate the concept beyond basic imagery
- Make sure it is always black and white

"""
# --- Prepend a base prompt to the user's input --- 
base_prompt = pr
user_prompt = args.prompt
contents = f"{base_prompt}{user_prompt}"
# --- End of modification ---
response = client.models.generate_content(
    model="gemini-2.0-flash-preview-image-generation",
    contents=contents,
    config=types.GenerateContentConfig(
      response_modalities=['TEXT', 'IMAGE']
    )
)

for part in response.candidates[0].content.parts:
  if part.text is not None:
    print(f"Text response: {part.text}")
  elif part.inline_data is not None:
    image_bytes = part.inline_data.data
    image = Image.open(BytesIO(image_bytes))
    # image.save('gemini-native-image.png') # Keep or remove this, it's separate from the gallery

    # --- New code to save image for the gallery ---
    save_dir = os.path.join("public", "generated_tattoos")
    os.makedirs(save_dir, exist_ok=True) # Create directory if it doesn't exist

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = f"tattoo_{timestamp}.png"
    save_path = os.path.join(save_dir, filename)
    
    try:
        image.save(save_path)
        public_path = f"/generated_tattoos/{filename}" # Path relative to public folder
        print(f"IMAGE_PATH:{public_path}")
    except Exception as e:
        print(f"Error saving image for gallery: {e}", file=sys.stderr)
    # --- End of new code ---

    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    print(f"IMAGE_BASE64:{img_str}")