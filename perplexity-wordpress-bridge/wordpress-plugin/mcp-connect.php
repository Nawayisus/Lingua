<?php
/**
 * Plugin Name: MCP Connect for WordPress
 * Plugin URI: https://github.com/your-repo/mcp-connect
 * Description: Enables secure communication between AI agents (like Perplexity) and WordPress via a simplified REST API.
 * Version: 1.0.0
 * Author: Jules (AI Assistant)
 * Author URI: https://example.com
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class MCP_Connect {

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        $namespace = 'wpmcp/v1';

        // 1. List Posts (GET) & Create Post (POST)
        register_rest_route($namespace, '/posts', array(
            array(
                'methods'             => 'GET',
                'callback'            => array($this, 'get_posts'),
                'permission_callback' => array($this, 'check_read_permission'),
                'args'                => array(
                    'status' => array(
                        'default' => 'publish,draft',
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'limit' => array(
                        'default' => 5,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array($this, 'create_post'),
                'permission_callback' => array($this, 'check_write_permission'),
                'args'                => array(
                    'title'   => array('required' => true, 'sanitize_callback' => 'sanitize_text_field'),
                    'content' => array('required' => true, 'sanitize_callback' => 'wp_kses_post'), // Allow HTML
                    'status'  => array('default' => 'draft', 'sanitize_callback' => 'sanitize_text_field'),
                ),
            ),
        ));

        // 2. Get Single Post (GET) & Update Post (POST/PUT)
        register_rest_route($namespace, '/posts/(?P<id>\d+)', array(
            array(
                'methods'             => 'GET',
                'callback'            => array($this, 'get_single_post'),
                'permission_callback' => array($this, 'check_read_permission'),
            ),
            array(
                'methods'             => 'POST', // Using POST for updates to be safe with some hosting setups
                'callback'            => array($this, 'update_post'),
                'permission_callback' => array($this, 'check_write_permission'),
                'args'                => array(
                    'title'   => array('sanitize_callback' => 'sanitize_text_field'),
                    'content' => array('sanitize_callback' => 'wp_kses_post'),
                    'status'  => array('sanitize_callback' => 'sanitize_text_field'),
                ),
            ),
        ));
    }

    /**
     * Permission: Can the user read posts?
     */
    public function check_read_permission() {
        return current_user_can('edit_posts'); // Require authentication
    }

    /**
     * Permission: Can the user write posts?
     */
    public function check_write_permission() {
        return current_user_can('publish_posts'); // Require authentication
    }

    /**
     * GET /posts
     * Returns a simplified list of posts for the AI.
     */
    public function get_posts($request) {
        $args = array(
            'post_type'      => 'post',
            'posts_per_page' => $request['limit'],
            'post_status'    => explode(',', $request['status']),
            'orderby'        => 'date',
            'order'          => 'DESC',
        );

        $query = new WP_Query($args);
        $posts = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = array(
                    'id'      => get_the_ID(),
                    'title'   => get_the_title(),
                    'status'  => get_post_status(),
                    'date'    => get_the_date('Y-m-d H:i:s'),
                    'excerpt' => get_the_excerpt(),
                    'link'    => get_permalink(),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($posts, 200);
    }

    /**
     * GET /posts/{id}
     * Returns full content of a specific post.
     */
    public function get_single_post($request) {
        $post_id = $request['id'];
        $post = get_post($post_id);

        if (!$post) {
            return new WP_Error('no_post', 'Post not found', array('status' => 404));
        }

        $data = array(
            'id'      => $post->ID,
            'title'   => $post->post_title,
            'content' => $post->post_content,
            'status'  => $post->post_status,
            'date'    => $post->post_date,
            'link'    => get_permalink($post->ID),
        );

        return new WP_REST_Response($data, 200);
    }

    /**
     * POST /posts
     * Creates a new post.
     */
    public function create_post($request) {
        $post_data = array(
            'post_title'   => $request['title'],
            'post_content' => $request['content'],
            'post_status'  => $request['status'],
            'post_author'  => get_current_user_id(),
            'post_type'    => 'post',
        );

        $post_id = wp_insert_post($post_data, true);

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        return new WP_REST_Response(array(
            'id'      => $post_id,
            'message' => 'Post created successfully.',
            'link'    => get_permalink($post_id),
            'status'  => get_post_status($post_id),
        ), 201);
    }

    /**
     * POST /posts/{id}
     * Updates an existing post.
     */
    public function update_post($request) {
        $post_id = $request['id'];
        $post = get_post($post_id);

        if (!$post) {
            return new WP_Error('no_post', 'Post not found', array('status' => 404));
        }

        // Only update fields that are provided
        $post_data = array(
            'ID' => $post_id,
        );

        if (isset($request['title'])) {
            $post_data['post_title'] = $request['title'];
        }
        if (isset($request['content'])) {
            $post_data['post_content'] = $request['content'];
        }
        if (isset($request['status'])) {
            $post_data['post_status'] = $request['status'];
        }

        $updated_post_id = wp_update_post($post_data, true);

        if (is_wp_error($updated_post_id)) {
            return $updated_post_id;
        }

        return new WP_REST_Response(array(
            'id'      => $updated_post_id,
            'message' => 'Post updated successfully.',
            'link'    => get_permalink($updated_post_id),
            'status'  => get_post_status($updated_post_id),
        ), 200);
    }
}

new MCP_Connect();
