<?php defined( 'ABSPATH' ) || exit; ?><script><?php if($atts['db']){?>const widgetDb = "<?php echo $atts['db']; ?>";<?php } ?><?php if($atts['media']){?>const widgetMedia = "<?php echo $atts['media']; ?>";<?php } ?><?php if($atts['locale']){?>const widgetLocale = "<?php echo $atts['locale']; ?>";<?php } ?></script><section class="dreamtonics widget" <?php if($atts['id']){?> data-track="<?php echo $atts['id'];?>"<?php } ?>><div class="player__content"><div class="player"></div><div class="player__controls"><button class="player__prev"><?php _e("Previous"); ?></button><button class="player__play"><?php _e("Play"); ?></button><button class="player__pause"><?php _e("Pause"); ?></button><button class="player__next"><?php _e("Next"); ?></button></div><div class="player__track"><span class="player__trackname"><?php _e("Trackname"); ?></span></div><div class="player__progress"><div class="player__seek-bar"><div class="player__play-bar"></div></div></div><div class="player__mode"><label><?php _e("Vocal Mode"); ?></label><div class="player__mode_select"><button class="player__mode_prev"><?php _e("Previous"); ?></button><span class="player__mode_name"><?php _e("Loading"); ?></span><button class="player__mode_next"><?php _e("Next"); ?></button></div></div></div></section>