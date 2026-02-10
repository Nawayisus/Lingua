import os
import httpx
from dotenv import load_dotenv

# Load configuration
load_dotenv()

WP_URL = os.getenv("WP_URL")
WP_USER = os.getenv("WP_USER")
WP_APP_PASSWORD = os.getenv("WP_APP_PASSWORD")

if not WP_URL or not WP_USER or not WP_APP_PASSWORD:
    print("Error: Missing configuration in .env file.")
    exit(1)

print(f"Testing connection to {WP_URL}...")

try:
    with httpx.Client(auth=httpx.BasicAuth(WP_USER, WP_APP_PASSWORD)) as client:
        # 1. Test basic connectivity to WP API
        response = client.get(f"{WP_URL}/wp-json/")
        if response.status_code == 200:
            print("✅ WordPress REST API is reachable.")
        else:
            print(f"❌ Failed to reach WordPress API. Status: {response.status_code}")
            print(response.text)
            exit(1)

        # 2. Test our custom plugin endpoint
        response = client.get(f"{WP_URL}/wp-json/wpmcp/v1/posts", params={"limit": 1})
        if response.status_code == 200:
            print("✅ MCP Plugin is active and responding.")
            posts = response.json()
            print(f"   Found {len(posts)} posts.")
        elif response.status_code == 404:
            print("❌ MCP Plugin endpoint not found. Did you activate the plugin?")
        elif response.status_code == 401 or response.status_code == 403:
            print("❌ Authentication failed. Check your username and Application Password.")
        else:
            print(f"❌ Unexpected error. Status: {response.status_code}")
            print(response.text)

except Exception as e:
    print(f"❌ Connection error: {e}")
