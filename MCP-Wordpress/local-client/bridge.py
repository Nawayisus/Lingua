import os
import sys
import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

# Load configuration
load_dotenv()

WP_URL = os.getenv("WP_URL")
WP_USER = os.getenv("WP_USER")
WP_APP_PASSWORD = os.getenv("WP_APP_PASSWORD")

if not WP_URL or not WP_USER or not WP_APP_PASSWORD:
    print("Error: Missing configuration in .env file.", file=sys.stderr)
    sys.exit(1)

# Initialize MCP Server
mcp = FastMCP("WordPress Bridge")

# Helper for HTTP requests
def get_client():
    return httpx.Client(
        base_url=WP_URL,
        auth=httpx.BasicAuth(WP_USER, WP_APP_PASSWORD),
        timeout=30.0
    )

@mcp.tool()
def list_recent_posts(limit: int = 5, status: str = "publish,draft") -> str:
    """
    List recent posts from the WordPress site.
    Args:
        limit: Number of posts to retrieve (default 5).
        status: Comma-separated list of statuses (e.g., 'publish,draft').
    """
    endpoint = "/wp-json/wpmcp/v1/posts"
    try:
        with get_client() as client:
            response = client.get(endpoint, params={"limit": limit, "status": status})
            response.raise_for_status()
            posts = response.json()

            if not posts:
                return "No posts found."

            result = []
            for post in posts:
                result.append(f"- [{post['id']}] {post['title']} ({post['status']}) - {post['date']}")
            return "\n".join(result)
    except httpx.HTTPStatusError as e:
        return f"Error connecting to WordPress: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
def create_post(title: str, content: str, status: str = "draft") -> str:
    """
    Create a new post on WordPress.
    Args:
        title: The title of the post.
        content: The HTML content of the post.
        status: 'draft' (default) or 'publish'.
    """
    endpoint = "/wp-json/wpmcp/v1/posts"
    try:
        with get_client() as client:
            payload = {
                "title": title,
                "content": content,
                "status": status
            }
            response = client.post(endpoint, json=payload)
            response.raise_for_status()
            data = response.json()
            return f"Success! Post created via MCP Bridge. ID: {data['id']}. Link: {data['link']}"
    except httpx.HTTPStatusError as e:
        return f"Error creating post: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
def get_post_content(post_id: int) -> str:
    """
    Get the full content of a specific post by ID.
    Args:
        post_id: The ID of the post to retrieve.
    """
    endpoint = f"/wp-json/wpmcp/v1/posts/{post_id}"
    try:
        with get_client() as client:
            response = client.get(endpoint)
            response.raise_for_status()
            data = response.json()
            return f"Title: {data['title']}\nStatus: {data['status']}\n\nContent:\n{data['content']}"
    except httpx.HTTPStatusError as e:
        return f"Error retrieving post: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
def update_post(post_id: int, title: str = None, content: str = None, status: str = None) -> str:
    """
    Update an existing post.
    Args:
        post_id: The ID of the post to update.
        title: New title (optional).
        content: New content (optional).
        status: New status (optional).
    """
    endpoint = f"/wp-json/wpmcp/v1/posts/{post_id}"
    payload = {}
    if title: payload['title'] = title
    if content: payload['content'] = content
    if status: payload['status'] = status

    if not payload:
        return "No changes provided."

    try:
        with get_client() as client:
            response = client.post(endpoint, json=payload) # Using POST for update as per plugin design
            response.raise_for_status()
            data = response.json()
            return f"Success! Post updated. ID: {data['id']}. New Status: {data['status']}"
    except httpx.HTTPStatusError as e:
        return f"Error updating post: {e.response.status_code} - {e.response.text}"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    # Standard MCP server execution
    mcp.run()
