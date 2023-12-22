<?php
/**
 * Plugin Name: Cover Media Slideshow
 * Version: 1.0.0
 * Author: Blake Davis
 * Description: A flexible Gutenberg block for creating multimedia sliders.
 * Text Domain: organized-slop-cover-media-slideshow
 */



// Exit if accessed directly.
if ( ! defined( "ABSPATH" ) ) {
	exit;
}



function rlb_media_slider_block_init() {
    wp_enqueue_script("jquery");

    wp_register_script(
        "rlb-media-slider/editor-script",
        plugins_url("media-slider-editor.js", __FILE__),
        ["wp-blocks", "wp-element", "wp-editor", "wp-components", "wp-i18n", "wp-data"],
        filemtime(plugin_dir_path(__FILE__) . "/media-slider-editor.js")
    );

    // Make plugins url available in media-slider-editor.js
    $translation_array = ["defaultImage" => plugins_url() . "/rlb-media-slider/assets/default-slide.jpg"];
    wp_localize_script("rlb-media-slider/editor-script", "jsVars", $translation_array );


    wp_register_style(
        "rlb-media-slider/stylesheet",
        plugins_url("media-slider-style.css", __FILE__),
        ["wp-edit-blocks"],
        filemtime(plugin_dir_path(__FILE__) . "/media-slider-style.css")
    );

    register_block_type(
        "rlb-media-slider/block-libary",
        ["api_version"   => 2,
         "title"         => "RLB Media Slider",
         "icon"          => "cover-image",
         "editor_script" => "rlb-media-slider/editor-script",
         "style"         => "rlb-media-slider/stylesheet"
        ]
    );
}
add_action("init", "rlb_media_slider_block_init");





add_action("wp_enqueue_scripts", function() {
    wp_enqueue_script("rlb-media-slider/render-script");
    wp_enqueue_script("rlb-media-slider/frontend-script");

    wp_register_script("rlb-media-slider/render-script", plugins_url("/media-slider-render.js", __FILE__), null);
    wp_register_script("rlb-media-slider/frontend-script", plugins_url("/media-slider-frontend.js", __FILE__), ["wp-api-fetch", "wp-polyfill", "wp-data"]);
});




// Set script elements' "type" attribute to "module" to allow importing between js files
function rlb_media_slider_set_script_type($tag, $handle, $src) {
    $module_handles = ["rlb-media-slider/editor-script",
                       "rlb-media-slider/render-script",
                       "rlb-media-slider/frontend-script"];

    if (in_array($handle, $module_handles)) {
        $tag = "<script type='module' src='$src'></script>";
    }

    return $tag;
}
add_filter("script_loader_tag", "rlb_media_slider_set_script_type", 10, 3);





// ============================================================================
// AJAX Stuff
// ============================================================================
function get_media_slider_items($params) {
    return ["asdf"];
}
add_action("wp_ajax_get_media_slider_items", "get_media_slider_items");
add_action("wp_ajax_nopriv_get_media_slider_items", "get_media_slider_items");





function rlb_media_slider_rest_api_init() {
    register_rest_route("rodney-lee-brands/rlb-media-slider",
                        "/items",
                        ["methods"             => ["GET", "POST", "PUT"],
                         "permission_callback" => "__return_true",
                         "callback"            => function (\WP_REST_Request $request) {

                                                      return array( "request"    => $request,
                                                                    "headers"    => $request->get_headers(),
                                                                    "parameters" => $request->get_params(),
                                                                    "html"       => get_media_slider_items($request->get_params()));
                                                  }, // end callback function
    ]);
}
add_action("rest_api_init", "rlb_media_slider_rest_api_init", 10, 1);

