import unittest
from unittest.mock import patch, MagicMock
import os
import sys

# Ensure we can import bridge.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bridge import list_recent_posts, create_post, get_post_content, update_post

class TestWordPressBridge(unittest.TestCase):

    @patch('bridge.get_client')
    def test_list_recent_posts_success(self, mock_get_client):
        # Mock the HTTP response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {'id': 1, 'title': 'Test Post', 'status': 'publish', 'date': '2023-10-27'}
        ]

        # Mock the client context manager
        mock_client = MagicMock()
        mock_client.get.return_value = mock_response
        mock_get_client.return_value.__enter__.return_value = mock_client

        # Call the function
        result = list_recent_posts()

        # Assertions
        self.assertIn("Test Post", result)
        self.assertIn("[1]", result)
        mock_client.get.assert_called_with("/wp-json/wpmcp/v1/posts", params={"limit": 5, "status": "publish,draft"})

    @patch('bridge.get_client')
    def test_create_post_success(self, mock_get_client):
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {
            'id': 101,
            'message': 'Post created successfully.',
            'link': 'http://example.com/p=101',
            'status': 'draft'
        }

        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_get_client.return_value.__enter__.return_value = mock_client

        result = create_post("New Title", "New Content")

        self.assertIn("Success!", result)
        self.assertIn("ID: 101", result)
        mock_client.post.assert_called()

    @patch('bridge.get_client')
    def test_get_post_content_success(self, mock_get_client):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'id': 1,
            'title': 'My Post',
            'content': '<p>Hello World</p>',
            'status': 'publish'
        }

        mock_client = MagicMock()
        mock_client.get.return_value = mock_response
        mock_get_client.return_value.__enter__.return_value = mock_client

        result = get_post_content(1)

        self.assertIn("Title: My Post", result)
        self.assertIn("Hello World", result)

if __name__ == '__main__':
    unittest.main()
