/*
 * File: collapsible-list.js
 * -------------------------
 * Defines the set of interactions needed to support
 * collapsible lists.  A list item is collapsible
 * if there is an <ul> among its direct children.
 */
"use strict";

/**
 * Function: toggleListItem
 * ------------------------
 * Triggers the selected li node to either expand or collapse. Accepts an event
 * "e", where "e.target" is the li node that was clicked.
 */
function toggleListItem(e) { // e.target must be a collapsible list
    // TODO: implement this function
    if (e.target.classList.contains("closed")) {
        e.target.classList.remove(("closed"));
        e.target.classList.add("open");
    }
    else if (e.target.classList.contains(("open"))){
        e.target.classList.remove(("open"));
        e.target.classList.add("closed");
    }
    e.stopPropagation();
}

/**
 * Function: ConfigureCollapsibleList
 * ----------------------------------
 * Configures all nested lists to be initially collapsed, and adds a click
 * listener to each list item that has a child list.
 */
function ConfigureCollapsibleList() {
    let nodes = document.getElementsByTagName("li");
    // TODO: for each li node that has a ul child, add the "closed" class and
    // add a click listener that calls toggleListItem
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.getElementsByTagName("ul").length > 0) {
            node.classList.add("closed");
            node.addEventListener("click", toggleListItem);
        }
    }

}

document.addEventListener("DOMContentLoaded", ConfigureCollapsibleList);
