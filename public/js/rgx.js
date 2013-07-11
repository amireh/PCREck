(function() {
  var
  rgx = function() {
    var mode = null,
        pattern_el = null,
        options_el = null,
        subject_el = null,
        tt = null,
        pulse = 50,
        is_operating = false,
        dialect = "PCRE";

    // UI lists
    function hide_list_callback(e) {
      e.preventDefault();

      rgx.lists.hide($(".listlike.selected:visible"));

      return false;
    }



    function mode_operation(op) {
      if (mode != "simple" && mode != "advanced") {
        console.log("Error: an invalid rgx mode '" + mode + "' has been set, unable to query.")
        return false;
      }

      return rgx[mode][op]();
    }

    /**
     * format_result():
     *  Decodes the rgx response, injects (and highlights) matched and captured values
     *  in the respective elements.
     *
     * Parameters:
     *  1. result; a JSON object containing the rgx result
     *  2. subject; the subject (text) the result applies to
     *  3. match_el; jQuery handle to the element that contains the matches
     *  4. capture_el; jQuery handle to the element that contains the captures
     *  5. subject_idx; the index of the subject (ONLY IN ADVANCED MODE)
     */
    function format_result(result, subject, match_el, capture_el, subject_idx) {
      if (result.length == 0) {
        mode == "simple"
          ? rgx.simple.reset_status("No match.")
          : rgx.advanced.reset_status(subject_idx, "No match.");

        return;
      }

      if (result.error) {
        mode == "simple"
          ? rgx.simple.reset_status("Error: " + result.error)
          : rgx.advanced.reset_status(subject_idx, "Error: " + result.error);

        return;
      }

      var match = subject,
          match_begin = result[0],
          match_end = result[1] - 1;

      match = match.split('');
      match[match_begin] = "<em>" + match[match_begin];
      match[match_end] = match[match_end] + "</em>";
      match = match.join('');
      // this is required for highlighting linebreaks and whitespace
      match = match.replace(' ', "&nbsp;").replace(/\n/g, "&nbsp;<br />");

      match_el.html(match);
      capture_el.empty();
      // starting from 2 since the first two elements are the match boundaries
      for (var i = 2; i < result.length; ++i) {
        capture_el.append("  %" + (i-1) + " => " + result[i] + "\n");
      }
    }

    return {
      this: this,
      dialect: dialect,
      setup: function() {
        // these are constant across all modes
        pattern_el = $("#rgx_pattern"),
        options_el = $("#rgx_pattern_options");
      },
      /** accepted modes: "simple"|"advanced" */
      set_mode: function(in_mode) {
        mode = in_mode;

        if (in_mode == "simple") {
          subject_el = $("#rgx_subject");
        }
      },
      pulsate: function() {
        if (tt) { clearTimeout(tt); }
        tt = setTimeout("rgx.query()", pulse);
      },
      // mode-agnostic helpers
      query: function() {
        if (is_operating)
          return;

        return mode_operation('query');
      },
      gen_permalink: function() {
        if (is_operating)
          return;

        return mode_operation('gen_permalink');
      },

      status: {
        mark_pending: function() {
          $("#indicator").show();
          is_operating = true;
        },

        mark_ready: function() {
          $("#indicator").hide();
          is_operating = false;
        }
      },

      lists: {
        show: function() {
          if ($(this).parent("[disabled],:disabled,.disabled").length > 0)
            return false;

          rgx.lists.hide($("a.listlike.selected"));

          $(this).next("ol").show();
            // .css("left", $(this).position().left);
          $(this).addClass("selected");
          $(this).unbind('click', rgx.lists.show);
          $(this).add($(window)).bind('click', hide_list_callback);

          return false;
        },

        hide: function(el) {
          $(el).removeClass("selected");
          $(el).next("ol").hide();
          $(el).add($(window)).unbind('click', hide_list_callback);
          $(el).bind('click', rgx.lists.show);
        }
      },

      simple: {
        reset_status: function(text) {
          $("#rgx_match").empty().html(text || "");
          $("#rgx_capture").empty();
        },
        query: function() {
          var p = pattern_el.attr("value"),
              o = options_el.attr("value"),
              s = subject_el.attr("value");

          if (p.length == 0) {
            rgx.simple.reset_status();
            return false;
          }

          $.ajax({
            url: "/" + rgx.dialect,
            type: "POST",
            data: { pattern: p, subject: s, options: o },
            success: function(result) {
              result = JSON.parse(result);
              return format_result(result, s, $("#rgx_match"), $("#rgx_capture"));
            }
          });

          return false;
        },

        gen_permalink: function() {
          var p = pattern_el.attr("value"),
              o = options_el.attr("value"),
              s = subject_el.attr("value");
              // e  = $("#rgx_engine :checked").attr("value");

          if (p.length == 0 && s.length == 0) {
            return;
          }

          $.ajax({
            url: "/" + rgx.dialect + "/permalink",
            type: "POST",
            data: { pattern: p, subject: s, options: o, mode: "simple" },
            success: function(url) {
              $("#permalink").
                html("Your expression can be viewed at: "
                     + "<a target='_blank' href='" + url + "'>"
                     + url + "</a>");
            }
          });
        }
      },
      advanced: {
        reset_status: function(idx, text) {
          var subject =
            $("[data-dyn-entity=subjects][data-dyn-index=" + idx + "]");

          subject.find('.match').empty().html(text || "");
          subject.find('.capture').empty();
        },

        query: function(pattern, options, subjects) {
          if (pattern_el.attr("value").length == 0) {
            rgx.advanced.reset_status();
            return false;
          }

          var p = pattern_el.attr("value"),
              o = options_el.attr("value"),
              s = [];

          $("textarea:visible[name*=subject]").each(function() {
            s.push( $(this).attr("value") );
          })

          $.ajax({
            url: "/" + rgx.dialect + "/advanced",
            type: "POST",
            data: { pattern: p, subjects: s, options: o },
            success: function(resultset) {
              resultset = JSON.parse(resultset);

              $.each(resultset, function(subject_idx, result) {
                var subject_el  = $("[data-dyn-entity=subjects][data-dyn-index=" + subject_idx + "]"),
                    match_el    = subject_el.find(".match:first"),
                    capture_el  = subject_el.find(".capture:first"),
                    subject     = subject_el.find("textarea:first").attr("value");

                format_result(result,
                              subject,
                              match_el,
                              capture_el,
                              subject_idx);
              });
            }
          });

          return false;
        }, // advanced.query()
        gen_permalink: function() {
          var params = $("textarea:visible,input[type=text]:visible").serialize();
          params += "&mode=advanced";

          $.ajax({
            url: "/" + rgx.dialect + "/permalink",
            type: "POST",
            data: params,
            success: function(url) {
              $("#permalink").html("Your expression can be viewed at: <a target='_blank' href='" + url + "'>" + url + "</a>");
            }
          });
        }
      }
    }
  }();

  // rgx = rgx();
  $(function() {
    rgx.setup();

    $(document).ajaxStart(rgx.status.mark_pending);
    $(document).ajaxComplete(rgx.status.mark_ready);

    $("input[type=text], textarea").keyup(rgx.pulsate);
    $("input[type=checkbox]").change(rgx.pulsate);
    $("input[type=radio]").change(rgx.pulsate);
    $("textarea").autosize();

    $("a.listlike:not(.selected)").bind('click', rgx.lists.show);
    $("ol.listlike li, ol.listlike li *").click(function() {
      var anchor = $(this).parent().prev("a.listlike");
      if (anchor.hasClass("selected")) {
        rgx.lists.hide(anchor);
      }

      return true; // let the event propagate
    });

    $(".disabled").click(function() { return false; })

    $("[title]").tooltip({ animation: false, placement: "bottom" });
  });

  window.rgx = rgx;
})();