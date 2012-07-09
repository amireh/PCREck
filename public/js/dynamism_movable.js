

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