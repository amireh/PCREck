var callbacks = [];

// Replaces [ and ] with \\\[ and \\\] respectively.
// This is required for jQuery selectors locating attribute values that
// contain any bracket
function jquery_escape_query(str) {
  return str.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]');
}

// Joins an array of strings by [].
// Useful for building a nested ID and usually used with jquery_escape_query()
function indexize(str_arr) {
  if (typeof(str_arr) == "string")
    str_arr = [ str_arr ];
  var str = "";
  for (var i = 0; i < str_arr.length; ++i) {
    if (!str_arr[i] || str_arr[i] == "")
      continue;

    str += '[' + str_arr[i] + ']';
    // console.log("str arr: " + str_arr + " vs " + str)
  }
  return jquery_escape_query(str);
}

/**
 * Returns the display type of a given tag.
 *
 * Shamelessly stolen from an SO answer by Andy E.
 * Link: http://stackoverflow.com/questions/2880957/detect-inline-block-type-of-a-dom-element
 */
function getElementDefaultDisplay(tag) {
    var cStyle,
        t = document.createElement(tag),
        gcs = "getComputedStyle" in window;

    document.body.appendChild(t);
    cStyle = (gcs ? window.getComputedStyle(t, "") : t.currentStyle).display;
    document.body.removeChild(t);

    return cStyle;
}

// Array Remove - By John Resig (MIT Licensed)
// Link: http://ejohn.org/blog/javascript-array-remove/
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

function get_index(string, offset) {
  var offset = offset.length || 0;
  var lbf = false;
  var nr_str = "";
  for (var i = offset; i < string.length; ++i) {
    if (string[i] == ']')
      break;
    else if (lbf) {
      nr_str += string[i];
    }
    else if (string[i] == '[') {
      lbf = true;
    }
  }

  return nr_str.length == 0 ? null : parseInt(nr_str);
}

function locate_target(el) {
  var target_name = $(el).attr("data-dyn-target");
  var target_index = $(el).attr("data-dyn-target-index");

  // console.log("I'm DFing " + target_name + "[" + target_index + "]");

  var target = $(
      "[data-dyn-entity='" + jquery_escape_query(target_name) + "']"
    + "[data-dyn-index=" + target_index + "]");

  if (target.length == 0)
    return null;

  return target;
}

function dyn_rem() {
  var target = locate_target($(this));

  if (!target)
    return false;

  $.each(callbacks, function(i, cb) {
    cb(target, "rem");
  });

  target.remove();

  $.each(callbacks, function(i, cb) {
    cb(target, "post_rem");
  });
}

function dyn_add() {
  var target_name = $(this).attr("data-dyn-target");
  var target_index = $(this).attr("data-dyn-target-index") || -1;
  var extra_data = $(this).attr("data-dyn-extra");

  // console.log("I'm DFing " + target_name + "[" + target_index + "]");

  var target = $(
      "[data-dyn-entity='" + jquery_escape_query(target_name) + "']"
    + "[data-dyn-index=" + target_index + "]");

  if (target.length == 0)
    return false;

  //var target_name = target.attr("data-dyn-index");
  // console.log("Template: ")
  // console.log(target)

  // determine the next index (based on the last entry's index)
  var last_entry = $("[data-dyn-entity='" + jquery_escape_query(target_name) + "']:last");
  // console.log("Indexing from:");
  // console.log(last_entry);

  var next_index = parseInt(last_entry.attr("data-dyn-index")) + 1;

  // console.log("Next index: " + next_index)

  // do the actual cloning
  var clone = target.clone();

  // don't clone DF-template-exclusive properties
  // clone.attr({ "data-dyn-entity": null, "data-dyn-index": null, "hidden": false });
  clone.attr({  "hidden": false, "data-dyn-index": next_index });
  // clone.find("[data-dyn-entity]").attr({ "data-dyn-entity": null, "data-dyn-index": null, "hidden": false });

  var self = this;
  var __orig_parent_name = target_name + "[-1]";
  var __real_parent_name = target_name + "[" + next_index + "]";
  clone.find("*").each(function() {
    // // console.log($(this))

    var child = $(this);
    $.each($(this).get(0).attributes, function(i, pair) {
      // // console.log("changing attribute '" + pair.name + "' (" + pair.value + ")")
      try {
        child.attr(
          pair.name,
          pair.value.replace(__orig_parent_name, __real_parent_name));
      } catch (e) {
        // ignore properties that can't be changed
        // // console.log("Property " + pair.name + " can't be changed!")
      }
    });
    // if the child is an data-dyn-target itself, we add the new index
    // of its parent (the cloned entity) to its list of subindeces
    if (child.attr("data-dyn-target")) {
      // console.log("Checking data-dyn-target attr: " + child.attr("data-dyn-target") + " vs " + __real_parent_name);
    }
    // substitute the property value with the index for every element
    // with [data-dyn-substitute='index']
    if (child.attr("data-dyn-substitute") == "index") {
      child.html(next_index);
    }
    if (child.attr("data-dyn-target") == target_name) {
      child.attr("data-dyn-target-index", next_index);
    }
    // $(this).attr("name",
      // $(this).attr("name").replace(target_name + "[-1]",
        // target_name + "[" + next_index + "]"));
  });

  dyn_bind(clone);

  // clone.find("[data-dyn-target][data-dyn-action!='remove']").click(dyn_add);
  // clone.find("[data-dyn-target][data-dyn-action='remove']").click(dyn_rem);

  // console.log("Clone:")
  // console.log(clone)
  // console.log('--')

  if (extra_data) {
    clone.append("<input type='hidden' name='" + target_name + "[extra]'" +
      " value='" + extra_data + "' />");
  }

  target.parent().append(clone);

  $.each(callbacks, function(i, cb) {
    cb(clone, "add");
  });

  return false;
};



var dyn_swap = function(source, dest) {
  var raw_entity_id = source.attr("data-dyn-entity");
  var source_id = jquery_escape_query(raw_entity_id);

  // Swap the indexes
  var source_idx = source.attr("data-dyn-index");
  var dest_idx = dest.attr("data-dyn-index");

  // console.log("Swapping " + source_idx + " with " + dest_idx);

  var fq_source_id = indexize([ raw_entity_id, source_idx ]);
  var fq_dest_id = indexize([ raw_entity_id, dest_idx ]);

  // Change all occurences of dest_idx to source_idx in the destination's children
  dest.find("*").each(function() {
    var child = $(this);
    $.each($(this).get(0).attributes, function(i, pair) {
      if (pair.name.search(fq_dest_id) > -1)
        console.log("changing attribute '" + pair.name + "' (" + pair.value + ")")

      try {
        child.attr(
          pair.name,
          pair.value.replace(fq_dest_id, fq_source_id));
      } catch (e) {
        // ignore properties that can't be changed
      }
    });

    if (child.attr("data-dyn-substitute") == "index")
      child.html(source_idx);
    if (child.attr("data-dyn-target") == raw_entity_id && child.attr("data-dyn-target-index") == source_idx)
      child.attr("data-dyn-target-index", dest_idx);
  });

  // Change all occurences of source_idx to dest_idx in the source's children
  source.find("*").each(function() {
    var child = $(this);
    $.each($(this).get(0).attributes, function(i, pair) {
      if (pair.name.search(fq_source_id) > -1)
        console.log("changing attribute '" + pair.name + "' (" + pair.value + ")")

      try {
        child.attr(
          pair.name,
          pair.value.replace(fq_source_id, fq_dest_id));
      } catch (e) {
        // ignore properties that can't be changed
      }
    });

    if (child.attr("data-dyn-substitute") == "index")
      child.html(dest_idx);
    if (child.attr("data-dyn-target") == raw_entity_id && child.attr("data-dyn-target-index") == source_idx)
      child.attr("data-dyn-target-index", dest_idx);
  });

  dest.attr("data-dyn-index", source_idx);
  source.attr("data-dyn-index", dest_idx);
}
function dyn_move_up() {
  /**
   * 1. locate the target data-dyn-entity to be moved (source)
   * 2. locate the target's previous sibling (destination)
   * 3. swap indeces
   * 4. prepend the source to the destination
   */

  var raw_entity_id = $(this).attr("data-dyn-target");
  if (!raw_entity_id) {
    raw_entity_id = $(this).parents("[data-dyn-entity]:first").attr("data-dyn-entity");
  }

  var source_id = jquery_escape_query(raw_entity_id);


  var source = $(this).parents("[data-dyn-entity=" + source_id + "]:first");
  if (!source || source.length == 0) {
    console.log("dyn_move_up(): source could not be located - " + $(this).attr("data-dyn-target"));
    return false;
  }

  var source_idx = parseInt( source.attr("data-dyn-index") );

  if (source_idx == 0)
    return false;

  // console.log("Moving " + source_id + indexize([ source.attr("data-dyn-index") ]) );

  // var dest = source.prev("[data-dyn-entity=" + source_id + "][data-dyn-index=" + ( source_idx - 1) + "]:first")
  var dest = $("[data-dyn-entity=" + source_id + "][data-dyn-index=" + (source_idx - 1) + "]");

  if (!dest || dest.length == 0) {
    console.log("dyn_move_up(): dest could not be located - " + source_id + indexize([ source_idx ]));
    return false;
  }

  dyn_swap(source, dest);

  dest.before(source);

  // disable the move_up button (this) if the source has become the first entity
  var first_entity = $("[data-dyn-entity=" + source_id + "]:not([hidden]):first");
  var is_first_entity = first_entity.attr("data-dyn-index") == source.attr("data-dyn-index");
  $(this).attr({ disabled: is_first_entity });
  // enable the move down button
  source.find("[data-dyn-action='move_down']:first").attr({ disabled: null });

  // now handle the destination's buttons;
  var last_entity = $("[data-dyn-entity=" + source_id + "]:last");
  var is_last_entity = last_entity.attr("data-dyn-index") == dest.attr("data-dyn-index");
  // disable the move down if it has become the last one
  dest.find("[data-dyn-action='move_down']:first").attr({ disabled: is_last_entity });
  // re-enable the move up button because the source is now above it
  dest.find("[data-dyn-action='move_up']:first").attr({ disabled: null });
}

function dyn_move_down() {
  var raw_entity_id = $(this).attr("data-dyn-target");
  if (!raw_entity_id) {
    raw_entity_id = $(this).parents("[data-dyn-entity]:first").attr("data-dyn-entity");
  }
  var source_id = jquery_escape_query(raw_entity_id);

  // console.log("Moving " + source_id);

  var source = $(this).parents("[data-dyn-entity=" + source_id + "]:first");
  if (!source || source.length == 0) {
    console.log("dyn_move_up(): source could not be located - " + $(this).attr("data-dyn-target"));
    return false;
  }

  var source_idx = parseInt( source.attr("data-dyn-index") );

  // var dest = source.next("[data-dyn-entity=" + source_id + "][data-dyn-index][data-dyn-index!=-1]:first")
  var dest = $("[data-dyn-entity=" + source_id + "][data-dyn-index=" + (source_idx + 1) + "]");
  if (!dest || dest.length == 0) {
    console.log("dyn_move_up(): dest could not be located - " + source_id);
    return false;
  }

  dyn_swap(source, dest);

  dest.after(source);

  // disable the move_down button (this) if the source has become the last entity
  // and re-enable the move up button
  var last_entity = $("[data-dyn-entity=" + source_id + "]:last");
  var is_last_entity = last_entity.attr("data-dyn-index") == source.attr("data-dyn-index");
  $(this).attr({ disabled: is_last_entity });
  source.find("[data-dyn-action='move_up']:first").attr({ disabled: null });

  var first_entity = $("[data-dyn-entity=" + source_id + "]:not([hidden]):first");
  var is_first_entity = first_entity.attr("data-dyn-index") == dest.attr("data-dyn-index");
  // enable the move down button
  dest.find("[data-dyn-action='move_up']:first").attr({ disabled: is_first_entity });
  dest.find("[data-dyn-action='move_down']:first").attr({ disabled: null });
}

$(function() {
  $("[data-dyn-action='move_up']").click(dyn_move_up);
  $("[data-dyn-action='move_down']").click(dyn_move_down);
});

dyn_register_callback = function(cb) {
  callbacks.push(cb);
}
bind_dyn_handler = dyn_register_callback; // alias

dyn_bind = function(parent) {
  if (!parent || parent.length == 0)
    parent = $("*");

  parent.find("[data-dyn-target]:not([data-dyn-action]), [data-dyn-target][data-dyn-action='add']").click(dyn_add);
  parent.find("[data-dyn-target][data-dyn-action='remove']").click(dyn_rem);
  parent.find("[data-dyn-action='move_up']").click(dyn_move_up);
  parent.find("[data-dyn-action='move_down']").click(dyn_move_down);
}

$(function() {
  // hide all dyn templates (ones with [data-dyn-index = -1])
  $("[data-dyn-entity]:not([data-dyn-index])").attr({ "data-dyn-index": -1 });
  $("[data-dyn-entity][data-dyn-index=-1]").attr({ "hidden": "true" });

  // $("[data-dyn-action='move_up']:visible").each(function() {
    // console.log("moo");
    // var entity_id = $(this).parents("[data-dyn-entity]:first").attr("data-dyn-entity");
    //
  // });
  $("[data-dyn-index=0]").each(function() {
    $(this).find("[data-dyn-action='move_up']:first").attr({ disabled: true });
    $("[data-dyn-entity=" + jquery_escape_query($(this).attr("data-dyn-entity")) + "][data-dyn-index!=-1]:last").find("[data-dyn-action='move_down']:first").attr({ disabled: true })
  });

  dyn_register_callback(function(clone, action) {
    if (action == "add") {
      clone.find("[data-dyn-action='move_down']:first").attr({ disabled: true });
      if (clone.attr("data-dyn-index") != 0)
        clone.prev("[data-dyn-entity]:first").find("[data-dyn-action='move_down']:first").attr({ disabled: null });
      else
        clone.find("[data-dyn-action='move_up']:first").attr({ disabled: true })
    }
    else if (action == "rem") {
      var idx = clone.attr("data-dyn-index");
      var is_last = clone.siblings("[data-dyn-entity]:last").attr("data-dyn-index") == idx - 1;

      if (idx == 0) {
        clone.next("[data-dyn-entity]:first").find("[data-dyn-action='move_up']:first").attr({ disabled: null });
      }
      else if (is_last) {
        var dest = clone.prev("[data-dyn-entity]:first");
        dest.find("[data-dyn-action='move_down']:first").attr({ disabled: true });
        dest.find("[data-dyn-action='move_up']:first").attr({ disabled: null });
      }
    }
  });

  // bind template buttons
  dyn_bind();
  // $("[data-dyn-entity]").each(function() { dyn_refresh_swap_buttons($(this)) });
  // $("[data-dyn-target][data-dyn-action!='remove'], [data-dyn-target][data-dyn-action^='add']").click(dyn_add);
  // $("[data-dyn-target][data-dyn-action='remove']").click(dyn_rem);
});
