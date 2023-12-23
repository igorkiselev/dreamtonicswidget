(function($) {
    $(document).ready(function() {
        
        const $d = $(".dreamtonics"),
                $widget = $d.filter(".widget"),
                $player = $d.find(".player"),
                activeClass = "active",
                loadingClass = "loading",
                selectedClass = "selected",
                revealedClass = "revealed";
                
        let selectedAi = 0, selectedAiMode = 0, trackTime = 0, aiVoiceWidget, mediaPlaying = 0;
        
        
        let combo, comboDelay = 250;
        
        const loadFileName = () => {
            let filename = widgetMedia + aiVoiceWidget.id + "_" + aiVoiceWidget.tracks[selectedAi].id + "_" + aiVoiceWidget["vocal-modes"][selectedAiMode] + ".ogg";
            return filename;
        };
        
        const loadPlayer = (item, id) => {
            
            !$d.hasClass(loadingClass) ? $d.addClass(loadingClass) : null;
            
            item ? !item.hasClass(loadingClass) ? item.addClass(loadingClass) : null : null;
            
            let json = $.getJSON(widgetDb, function(json) {
                
                json = json.voices;
                
                selectedAi = 0;
                selectedAiMode = 0;
                trackTime = 0;
                
                aiVoiceWidget = json.map(index => {
                    return index.id == id ? index : false;
                }).filter(el => {
                    return Object.keys(el).length !== 0 ? true : false;
                })[0];
                
                if(aiVoiceWidget){
                
                let tracks = aiVoiceWidget.tracks;
                
                if (tracks != null) {
                    
                    $d.find(".player__next, .player__prev, .player__mode_next, .player__mode_prev").prop("disabled", false);
                    
                    $text = false;
                    
                    $.each(aiVoiceWidget.text, function(index, value) {
                        $text = value.locale == widgetLocale ? value : $text;
                    });
                    
                    
                    $d.find(".player__ai_title").text($text.name);
                    $d.find(".player__ai_caption").text($text.copyright);
                    
                    $d.find(".player__select_combo").html("");
                    $.each(tracks, function(index, value) {
                        let $line = $("<li />", {
                            "data-track": index,
                            class: selectedAi == index ? "selected" : null
                        }).append(
                            $("<span />", {
                                text: value.title,
                                class: "player__select_track_name"
                            }),
                            $("<span />", {
                                text: value.language,
                                class: "player__select_track_tag"
                            })
                            
                        );
                        $d.find(".player__select_combo").append($line);
                    });
                    
                    $d.find(".player__trackname").text(tracks[selectedAi].title);
                    
                    let modes = aiVoiceWidget["vocal-modes"];
                    
                    $d.find(".player__mode_name").text(modes[selectedAiMode]);
                    
                    $player.jPlayer("setMedia", {
                        mp3: loadFileName()
                    });
                    
                    tracks.length == 1 ? $d.find(".player__next, .player__prev").prop("disabled", true) : $d.find(".player__prev").prop("disabled", true);
                    
                    modes.length == 1 ? $d.find(".player__mode_next, .player__mode_prev").prop("disabled", true) : $d.find(".player__mode_prev").prop("disabled", true);
                    
                    $d.hasClass("widget") ? !$widget.hasClass(activeClass) ? $widget.addClass(activeClass) : null : null;
                    
                    item ? item.removeClass(loadingClass) : null;
                    
                    $d.removeClass(loadingClass);
                }
                }else{
                    console.log("ID not found in database");
                }
            });
            
        };
       
        const setTrack = () => {
            $player.jPlayer("setMedia", {
                mp3: loadFileName()
            }).jPlayer("play");
            $d.find(".player__trackname").text(aiVoiceWidget.tracks[selectedAi].title);
            $(".player__select_combo li").removeClass(selectedClass);
            $(".player__select_combo li:nth-child(" + (selectedAi + 1) + ")").addClass(selectedClass);
        };
        const setMode = () => {
            $player.jPlayer("setMedia", {
                mp3: loadFileName()
            }).jPlayer("play", trackTime);
            $d.find(".player__mode_name").text(aiVoiceWidget["vocal-modes"][selectedAiMode]);
        };
        $player.jPlayer({
            ready: function() {
                $widget.data("track") ? loadPlayer(null, $widget.data("track")) : console.log("No id is set");
            },
            timeupdate: function(event) {
                if (parseInt(event.jPlayer.status.currentTime) != 0) {
                    trackTime = event.jPlayer.status.currentTime;
                }
            },
            play: function(event) {
                mediaPlaying = true;
            },
            pause: function(event) {
                mediaPlaying = false;
            },
            ended: function(event) {
                mediaPlaying = false;
            },
            swfPath: "/",
            solution: "html",
            cssSelectorAncestor: ".dreamtonics",
            supplied: "mp3,oga",
            wmode: "window",
            cssSelector: {
                play: ".player__play",
                pause: ".player__pause",
                stop: ".player__stop",
                seekBar: ".player__seek-bar",
                playBar: ".player__play-bar",
                mute: ".player__mute",
                unmute: ".player__unmute",
                volumeBar: ".player__volume-bar",
                volumeBarValue: ".player__volume-bar-value",
                volumeMax: ".player__volume-max",
                playbackRateBar: ".player__playback-rate-bar",
                playbackRateBarValue: ".player__playback-rate-bar-value",
                currentTime: ".player__current-time",
                duration: ".player__duration",
                title: ".player__title"
            }
        });
        
        $d.on("click", ".player__next:not(:disabled)", function(e) {
            selectedAi++;
            selectedAi > 0 ? $d.find(".player__prev").prop("disabled", false) : null;
            selectedAi + 1 >= aiVoiceWidget.tracks.length ? $(this).prop("disabled", true) : null;
            setTrack();
            e.preventDefault();
        });
        $d.on("click", ".player__prev:not(:disabled)", function(e) {
            selectedAi--;
            selectedAi >= 0 ? $d.find(".player__next").prop("disabled", false) : null;
            selectedAi == 0 ? $(this).prop("disabled", true) : null;
            setTrack();
            e.preventDefault();
        });
        $d.on("click", ".player__mode_next:not(:disabled)", function(e) {
            selectedAiMode++;
            selectedAiMode > 0 ? $d.find(".player__mode_prev").prop("disabled", false) : null;
            selectedAiMode + 1 >= aiVoiceWidget["vocal-modes"].length ? $(this).prop("disabled", true) : null;
            setMode();
            e.preventDefault();
        });
        $d.on("click", ".player__mode_prev:not(:disabled)", function(e) {
            selectedAiMode--;
            selectedAiMode >= 0 ? $d.find(".player__mode_next").prop("disabled", false) : null;
            selectedAiMode == 0 ? $(this).prop("disabled", true) : null;
            setMode();
            e.preventDefault();
        });
        
        $d.on("click", ".player__track:not(.player__select_active) .player__select", function(e) {
            $widget.find(".player__track").addClass("player__select_active");
            $d.find(".player__select_combo").css({
                maxWidth: $d.find(".player__track").width()
            });
            e.preventDefault();
        });
        
        $d.on("click", ".player__track.player__select_active .player__select", function(e) {
            $widget.find(".player__track").removeClass("player__select_active");
            combo = $widget.find(".player__track").hasClass("player__select_active") ? setTimeout(() => {
                $widget.find(".player__track").removeClass("player__select_active");
            }, comboDelay) : null;
            e.preventDefault();
        });
        
        $d.on("click", ".player__select_combo li", function(e) {
            selectedAi = $(this).attr("data-track") * 1;
            setTrack();
            $widget.find(".player__track").removeClass("player__select_active");
            e.preventDefault();
        });
        $d.on("mousemove", ".player__select_combo", function(e) {
            $widget.find(".player__track").hasClass("player__select_active") ? clearTimeout(combo) : null;
            e.preventDefault();
        });
        $d.on("mouseleave", ".player__select_combo", function(e) {
            combo = $widget.find(".player__track").hasClass("player__select_active") ? setTimeout(() => {
                $widget.find(".player__track").removeClass("player__select_active");
            }, comboDelay) : null;
            e.preventDefault();
        });
       

    });

    
})(jQuery);