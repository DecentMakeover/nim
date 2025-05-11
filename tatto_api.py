import requests
import json

# Replace with your actual Cloud Run URL
API_URL = "https://tattoo-gen-orb3x5u66q-el.a.run.app/generate-tattoo/"

# The prompt you want to send to the API
PROMPT_TEXT = "a majestic lion with a crown of stars"

def test_generate_tattoo():
    payload = {
        "prompt": PROMPT_TEXT
    }
    headers = {
        "Content-Type": "application/json"
    }

    print(f"Sending POST request to: {API_URL}")
    print(f"Payload: {json.dumps(payload)}\n")

    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=60) # Added timeout

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            try:
                response_data = response.json()
                print("Response JSON:")
                # Pretty print the JSON response
                print(json.dumps(response_data, indent=4))

                if response_data.get("text_response"):
                    print("\n--- Text Response ---")
                    print(response_data["text_response"])
                
                if response_data.get("image_base64"):
                    print("\n--- Image (Base64) ---")
                    print(f"Received {len(response_data['image_base64'])} bytes of base64 image data.")
                    # You can save this base64 string to a file and view it as an image
                    # For example:
                    # with open("generated_tattoo.png", "wb") as f:
                    #     import base64
                    #     f.write(base64.b64decode(response_data['image_base64']))
                    # print("\nImage saved to generated_tattoo.png (if uncommented)")
                
                if response_data.get("image_path"):
                    print(f"\nServer-side image path: {response_data['image_path']}")

            except json.JSONDecodeError:
                print("Error: Could not decode JSON response.")
                print(f"Response Text: {response.text}")
        elif response.status_code == 500:
            print("Error: Server returned a 500 Internal Server Error.")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=4)}")
            except json.JSONDecodeError:
                print(f"Could not decode error response: {response.text}")
        else:
            print(f"Error: Received status code {response.status_code}")
            print(f"Response Text: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request: {e}")

if __name__ == "__main__":
    test_generate_tattoo() 