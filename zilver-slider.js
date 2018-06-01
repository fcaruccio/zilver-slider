;
(function($) {

  $.fn.zilverSlider = function(options) {

    var defaults = {
      child_tag: "li",
      slide_speed: 500,
      el_to_click_to_slide_left: ".zilver-arrow",
      close_button: true,
      close_button_debug_mode: false,
      arrow: true,
      autoplay: false,
      autoplay_time: 2500
    }

    $.extend(defaults, options);

    var container = $(this);
    var children = container.children(defaults.child_tag);
    var counter = 0;
    var resizeId;

    $(window).resize(function() {
      clearTimeout(resizeId);
      resizeId = setTimeout(update_all, 500);
    });

    function __init() {

      create_close_button();
      create_arrow();
      autoplay();

      update_all_size();

      // Slide left on click to the selected element
      $(defaults.el_to_click_to_slide_left).on(
        "click",
        function() {
          slide_left_all_items($(this));
        }
      );

      // Slide left on arrowkey right
      $("body").keydown(function(e) {
        if (e.keyCode == 39) {
          // left
          slide_left_all_items();
        }
      });

      // Slide left swipe left
      container
        .on(
          "swipeleft",
          function() {
            slide_left_all_items();
          });

    }

    function update_all() {
      update_all_size();
    }

    function get_window_w() {
      return $(window).width();
    }

    function get_window_h() {
      return $(window).height();
    }

    function update_slider_w_and_h() {
      container.css({
        width: get_window_w(),
        height: get_window_h()
      });
    }

    function get_child_w() {
      return parseInt(children.first().width());
    }

    function update_items_h_and_zindex() {
      counter_reverse = container.children(defaults.child_tag).length;
      children.each(function() {
        $(this).css({
          "height": get_window_h(),
          "z-index": counter_reverse
        });
      });
    }

    function assign_left_css_value(el, counter) {
      el.css({
        left: get_child_w() * counter
      });
    }

    function update_child_size_and_h(animate) {
      counter = 0;
      counter_reverse = container.children(defaults.child_tag).length;

      container.children(defaults.child_tag).each(function() {

        update_items_h_and_zindex();

        assign_left_css_value($(this), counter);

        set_children_bg($(this));
        counter++;
        counter_reverse--;
      });
    }

    function set_children_bg(child) {
      var bg = child.attr("img");
      child.css({
        "background-image": "url(" + bg + ")"
      });
    }

    function update_all_size() {
      update_slider_w_and_h();
      update_child_size_and_h(false);
    }

    function get_item_w() {
      return parseInt(children.first().width());
    }

    function get_slider_length(start_from_zero) {
      if (start_from_zero == true) {
        return children.length - 1;
      } else {
        return children.length;
      }
    }

    function move_first_item_to_last() {
      container.children().first().appendTo(container);
    }

    function move_last_item_to_first() {
      container.prepend(container.children().last());
    }

    function slide_left_all_items() {
      children.each(function(i, el) {
        var el = $(el);
        var css_current_left_value = parseInt(el.css("left"));
        el
          .stop()
          .animate({
            left: (css_current_left_value - get_item_w()),
            duration: 1500
          }, 250, function() {
            if (i == get_slider_length(true)) {
              move_first_item_to_last();
              update_child_size_and_h(true);
            }
          });
      });
    }

    function create_close_button() {
      if (defaults.close_button == true) {
        container
          .append($("<span>", {
            class: "zilver-close"
          }))
          .css({
            "display": "block"
          });
        if (defaults.close_button_debug_mode == true) {
          container
            .children("span")
            .addClass("debug_mode");
        }
        close_slider();
      }
    }

    function create_arrow() {
      if (defaults.arrow == true) {
        container
          .append($("<span>", {
            class: "zilver-arrow"
          }));
      }
    }

    function close_slider() {
      container
        .children("span")
        .on({
          click: function() {
            container.fadeOut();
          }
        });
    }

    function autoplay() {
      var autoplay_interval;
      if(defaults.autoplay == true) {
        container
          .on({
            mouseenter: function(){
              clearInterval(autoplay_interval);
            },
            mouseleave: function(){
              slide_left_all_items();
              autoplay_interval = setInterval(function(){
                slide_left_all_items();
              }, defaults.autoplay_time);
            }
          });
      }
    }

    __init();

  }


})(jQuery);
