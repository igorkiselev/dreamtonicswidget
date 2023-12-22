<?php (!defined('ABSPATH')) ? exit : false; ?>
<div class="wrap">

	<h1><?php _e('Media widget settings'); ?></h1>

	<form method="post" action="options.php">
	
	<?php settings_fields('dreamtonicswidget'); ?>

	<?php $settings = get_option('dreamtonicswidget'); ?>
	
		<table class="form-table">
			<tr>
				<th scope="row">
					<label for="dreamtonicswidget_db"><?php _e('Default url to the voice database json file'); ?></label>
				</th>
				<td>
					<input
						name="dreamtonicswidget[db]"
						type="text"
						id="dreamtonicswidget_db"
						placeholder="https://"
						class="regular-text code"
						value="<?php echo !empty($settings['db']) ? $settings['db'] : null; ?>">
					<p class="description"></p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label for="dreamtonicswidget_media"><?php _e('Default url to the media files'); ?></label>
				</th>
				<td>
					<input
						name="dreamtonicswidget[media]"
						type="text"
						id="dreamtonicswidget_media"
						placeholder="https://alpha-resources.dreamtonics.com/demo-audio/"
						class="regular-text code"
						value="<?php echo !empty($settings['media']) ? $settings['media'] : null; ?>">
					<p class="description"></p>
				</td>
			</tr>
			
			<tr>
				<th scope="row">
				<?php _e('Shortcode'); ?>
				</th>
				<td>
					
						<input
						type="text"
						class="regular-text code"
						readonly=""
						value='[media_widget id="..."]'>
						<p class="description">Additional attributes for the shortcode are: media, db, locale</p>
						
				</td>
			</tr>
			
		</table>
		
	<?php do_settings_sections('theme-options'); ?>
	<?php submit_button(); ?>

	<p>
		<?php _e('Plugin to setup a media widget. Developed by <a href="//www.igorkiselev.com/">Igor Kiselev</a>. If yo have any questions feel free to contact me.'); ?>
	</p>
</form>
</div>