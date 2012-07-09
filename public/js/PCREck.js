PCREck = function() {
  var pattern_el = null,
      options_el = null,
      subject_el = null,
      tt = null,
      pulse = 50;

  return {
    this: this,
    setup: function() {
      pattern_el = $("#PCREck_pattern"),
      options_el = $("#PCREck_pattern_options");
    },
    /** accepted modes: "simple"|"advanced" */
    set_mode: function(in_mode) {
      if (in_mode == "simple") {
        subject_el = $("#PCREck_subject");
      }
    },
    pulsate: function() {
      if (tt) { clearTimeout(tt); }
      tt = setTimeout("PCREck.simple.query()", pulse);
    },

    simple: {
      reset_status: function(text) {
        $("#PCREck_match").empty().html(text || "");
        $("#PCREck_capture").empty();        
      },
      query: function() {
        var pattern = pattern_el.attr("value"),
            options = options_el.attr("value"),
            subject = subject_el.attr("value");

        if (pattern.length == 0) {
          PCREck.simple.reset_status();
          return;
        }

        $.ajax({
          url: "/",
          type: "POST",
          data: {
            pattern: "(?" + options + ")" + pattern,
            text: subject
          },
          success: function(result) {
            if (result.length == 0) {
              PCREck.simple.reset_status("No match.");
              return;
            }

            if (!result[0]) {
              PCREck.simple.reset_status("Error: " + result[1]);
              return;
            }

            var match = subject,
                match_begin = result[0] - 1, // subtract 1 because Lua starts indexes @ 1
                match_end = result[1] - 1;

            match = match.split('');
            match[match_begin] = "<em>" + match[match_begin];
            match[match_end] = match[match_end] + "</em>";
            match = match.join('');
            // this is required for highlighting linebreaks and whitespace
            match = match.replace(' ', "&nbsp;").replace(/\n/g, "&nbsp;<br />");

            $("#PCREck_match").html(match);
            $("#PCREck_capture").empty();
            // starting from 2 since the first two elements are the match boundaries
            for (var i = 2; i < result.length; ++i) {
              $("#PCREck_capture").append("  %" + (i-1) + " => " + result[i] + "\n");
            }
          }
        });

        return false;
      },

      gen_permalink: function() {
        var pattern = pattern_el.attr("value"),
            options = options_el.attr("value"),
            subject = subject_el.attr("value");

        if (pattern.length == 0 && subject.length == 0) {
          return;
        }

        $.ajax({
          url: "/permalink",
          type: "POST",
          data: {
            pattern: pattern,
            subject: subject,
            options: options
          },
          success: function(url) {
            $("#permalink").html("Your regular expression can be viewed at: <a href='" + url + "'>" + url + "</a>");
          }
        });
      }
    },
    advanced: {
      query: function(pattern, options, subjects) {

      }
    }
  }
}