<?php

/**
 * Plugin Name: Dreamtonics widget
 * Plugin URI: http://www.igorkiselev.com/wp-plugin/dreamtonics/
 * Description: Media player shortcode for products
 * Version: 1.0.0
 * Author: Igor Kiselev
 * Author URI: http://www.igorkiselev.com/
 * License: Something I have to figure out soon.
 */
 
defined( 'ABSPATH' ) || exit;

if ( !class_exists( 'DREAMTONICS_AUDIO_WIDGET' ) ) {

	class DREAMTONICS_AUDIO_WIDGET {
		private function version(){
			return WP_DEBUG ? rand(0, 100000) : false;
		}
		private function assets($file = null){
			if($file==null){
				return;
			}
			return trailingslashit(
				plugin_dir_url( __FILE__ ) 
			). "assets/" . $file;
		}
		private function template($file, $return=false, $atts=null){
				
				$filename = get_template_directory().$file.'.php';
				
				ob_start();
				
				
				if (file_exists($filename)) {
				
						include(get_template_directory(__FILE__)."/".$file.".php");
				
				} else {
				
						include(plugin_dir_path(__FILE__)."assets/templates/".$file.".php");
				
				}
		
				$content = ob_get_clean();
				
				if ($return) {
						return $content;
				} else {
						echo $content;
				}
		}
		
		public function __construct(){
			add_action('plugins_loaded', array($this , 'plugins_loaded'));
		}
		
		public function language(){
			load_theme_textdomain('dreamtonics', plugin_dir_path( __FILE__ ));
		}

		public function plugins_loaded(){
			add_action('wp_enqueue_scripts', array($this , '__enqueue'));
			
			add_shortcode('media_widget',  array($this, '__widget'));
			add_action( 'after_setup_theme', function(){
				remove_filter( 'the_content', 'wpautop' );
			} );
			add_action('admin_init', function () {
					register_setting('dreamtonicswidget', 'dreamtonicswidget');
			});
			
			add_action('admin_menu', array( $this, '__options'));
			add_filter('plugin_action_links_' . plugin_basename(__FILE__), array( $this, '__action_link'));
		}
		
		public function __enqueue(){
			$assets = array( "jquery.jplayer", "jquery.dreamtonics.widget");
			
			foreach ($assets as &$asset) {
				wp_register_script($asset, $this->assets("js/".$asset.'.min.js'), array('jquery'), $this->version(), true);
				wp_enqueue_script($asset);
			}
			
			$dir = plugin_dir_url(__FILE__);
			wp_enqueue_style('dreamtonics.widget', $this->assets("css/dreamtonics.widget.css"), array(), '0.1.0', 'all');
		}
		
		public function __widget($atts){
		
			if( !property_exists( (object) $atts, 'id') ){
				return;
			}
			
			$settings = get_option('dreamtonicswidget'); 
			
			if( !property_exists( (object) $atts, 'db') ){
				$atts['db'] = $settings['db'];
			}
			
			if( !property_exists( (object) $atts, 'media') ){
				$atts['media'] = $settings['media'];
			}
			
			if( !property_exists( (object) $atts, 'locale') ){
				$atts['locale'] = "en-us";
			}
			
			$content = $this->template("mediaplayer_widget", true, $atts); 
			
			$content = preg_replace('#^<\/p>|<p>$#', '', $content);
			
			return $content;
		
		}
		
		public function __action_link( $links){ 
				return array_merge($links, array('<a href="' . admin_url('options-general.php?page=dreamtonicswidget') . '">'.__('Settings').'</a>'));
		}
		
		public function __options(){
				
				add_options_page(__("Media widget"), __("Media widget"), 'manage_options', 'dreamtonicswidget', function () {
						
						if (!current_user_can('manage_options')) {
								
								wp_die(__('You do not have sufficient permissions to access this page.'));
								
						}
						
						include(plugin_dir_path(__FILE__) . 'assets/templates/options.php');
						
				});
				
		}
	
	}
	new DREAMTONICS_AUDIO_WIDGET();
}
