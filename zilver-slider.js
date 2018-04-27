;
(function($) {

  $.fn.zilverSlider = function(options) {

    var defaults = {
      child_tag: "li",
      autoplay: true,
      slide_speed: 500,
      landscape_selector: "landscape",
      portrait_selector: "portrait"
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

      add_remove_classes();

      update_all_size();

      $("body").on(
        "click",
        function() {
          slide_left($(this));
        }
      );
    }

    function update_all() {
      add_remove_classes();
      update_all_size();
    }

    function add_remove_classes() {
      if(get_is_landscape()) {
        $("body")
          .addClass(defaults.landscape_selector)
          .removeClass(defaults.portrait_selector);
      } else {
        $("body")
          .addClass(defaults.portrait_selector)
          .removeClass(defaults.landscape_selector);
      }
    }

    function get_is_landscape() {
      if(window.innerWidth > window.innerHeight) {
        return true;
      } else {
        return false;
      }
    }

    function get_window_width() {
      return $(window).width();
    }

    function get_window_height() {
      return $(window).height();
    }

    function update_slider_size() {
      container.css({
        width: get_window_width(),
        height: get_window_height()
      });
    }

    function get_child_width() {
      return parseInt(children.first().width());
    }

    function update_child_size_and_height(animate) {
      counter = 0;
      counter_reverse = container.children(defaults.child_tag).length;

      if (animate == true) {
        container.children(defaults.child_tag).each(function() {
          $(this).css({
            "z-index": counter_reverse
          })
          $(this).animate({
            left: get_child_width() * counter,
            height: get_window_height()
          });
          set_children_bg($(this));
          counter++;
          counter_reverse--;
        });
      } else {
        container.children(defaults.child_tag).each(function() {
          $(this).css({
            left: get_child_width() * counter,
            height: get_window_height()
          });
          set_children_bg($(this));
          counter++;
        });
      }
    }

    function set_children_bg(child) {
      var bg = child.attr("img");
      child.css({
        "background-image": "url(" + bg + ")"
      });
    }

    function update_all_size() {
      if($("body").hasClass(defaults.landscape_selector)){
        update_slider_size();
        update_child_size_and_height(false, false);
      }
    }

    function slide_left(slider) {
      if($("body").hasClass(defaults.landscape_selector)){
        container.children().first().clone(container);
        update_child_size_and_height(true, false);
      }
    }

    __init();

  }


})(jQuery);
