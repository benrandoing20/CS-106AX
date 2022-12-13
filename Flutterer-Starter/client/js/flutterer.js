/**
 * File: flutterer.js
 * ------------------
 * Contains the logic that makes Flutterer work, as well as all initialization.
 */
"use strict";

// Specify a list of valid users. (Extension opportunity: You can create an
// API route that lets users sign up, and then here, you can load a list of
// registered users.)
const USERS = [
    "Sophie Andrews",
    "Stephan Sharkov",
    "Ryan Guan",
    "Jonathan Kula",
    "Avi Gupta",
];

/**
 * Function: Flutterer
 * -------------------
 * Flutterer's entry point
 */
function Flutterer() {
    let floots = [];
    let user = USERS[0];

    //a set of action functions that may be accessed by other objects to
    // manipulate the DOM and server database
    let actions  = {
        /**
         * changeSelectedUser
         * ------------------
         * alter the user
         *
         * The change Selected User function will be called when a new user
         * is clicked in the server. The server UI is reset with the
         * getFloots() call to depict the change.
         *
         * @param username: a string name of the user
         */
        changeSelectedUser: function(username) {
            while (document.body.lastChild != null) {
                document.body.removeChild(document.body.lastChild);
            }
            user = username;
            getFloots();
        },
        /**
         * createFloot
         * -----------
         * create a new floot
         *
         * The create Floot method takes a string message to create a new
         * Floot object that is associated with the current user. The UI is
         * reset with the successHandler off getFloots to depict the change.
         *
         * @param message: string message to be part of th Floot object
         */
        createFloot: function(message) {
            let req = AsyncRequest("http://localhost:1066/api/floots");
            req.setMethod("POST");
            req.setPayload(JSON.stringify({
                username: user,
                message: message,
            }));
            // Handle success and error responses.
            req.setSuccessHandler(getFloots);
            req.send();
            // console.log("actions.createFloot was called, message:", message);
        },
        /**
         * deleteFloot
         * -----------
         * remove a floot from the sever and UI
         *
         * The delete Floot function will remove a floot wiith the provided
         * floot_id from the server and then reset the UI with the
         * getFloots() call.
         *
         * @param floot_id: a string unique id for a particular floot
         */
        deleteFloot: function(floot_id) {
            let req = AsyncRequest("http://localhost:1066/api/floots/"+floot_id+"/delete");
            req.setPayload(JSON.stringify({
                username: user
            }));
            req.setMethod("POST");
            req.setSuccessHandler(getFloots);
            req.send();
        },
        /**
         * openFlootInModal
         * ----------------
         * open a mini-window (Modal) that shows the Flot and comments
         *
         * The open Floot In Modal function will show a particular Floot
         * object in a small window when clicked. Th UI is reset without
         * getFloots since a different type f MainComponent must be created
         * with the flootObject.
         *
         * @param flootObject: Floot Object passed to be opened
         */
        openFlootInModal: function(flootObject) {
            while (document.body.lastChild !== null) {
                document.body.removeChild(document.body.lastChild);
            }
            document.body.appendChild(MainComponent(user, floots, actions, flootObject));
        },
        /**
         * closeModal
         * ----------
         * closes the Floot specific Modal screen
         *
         * The close Modal function will reset the UI without a Modal close
         * up view.
         */
        closeModal: function() {
            while (document.body.lastChild !== null) {
                document.body.removeChild(document.body.lastChild);
            }
            document.body.appendChild(MainComponent(user, floots, actions));
        },
        /**
         * createComment
         * -------------
         * create a Floot specific comment
         *
         * The create Comment function takes a message and adds it to a
         * Floot object. The UI is then reset with a call to get Floots.
         *
         * @param flootObject: Floot Object passed to be modified
         * @param message: string message to be part of th Floot object
         */
        createComment: function(flootObject, message) {
            let req = AsyncRequest("http://localhost:1066/api/floots/"+flootObject.id+"/comments");
            req.setMethod("POST");
            req.setPayload(JSON.stringify({
                username: user,
                message: message,
            }));
            // Handle success and error responses.
            req.setSuccessHandler(getFloots);
            req.send();
        },
        /**
         * deleteComment
         * -------------
         * remove a comment from a Floot Object
         *
         * The delete Comment function will remove a comment message from a
         * specific Floot when the userr deleting the comment is the same
         * user who created the comment.
         *
         * @param flootId: a string id unique to each floot object
         * @param comment_id: a string id unique to each comment object
         */
        deleteComment: function(flootId, comment_id) {
            let req = AsyncRequest("http://localhost:1066/api/floots/"+flootId+"/comments/"+comment_id+"/delete");
            req.setMethod("POST");
            req.setPayload(JSON.stringify({
                username: user
            }));
            // Handle success and error responses.
            req.setSuccessHandler(getFloots);
            req.send();
        }
    };

    // The code line below sets the initial screen
    document.body.appendChild(MainComponent(USERS[0], [], actions));

    /**
     * getFloots
     * ---------
     * gets Floot objects from server to depict on the screen
     *
     * The get Floots function will get all Floots from the server and
     * depict them with a MainComponent.
     */
    function getFloots() {
        let req = AsyncRequest("http://localhost:1066/api/floots");
        // Handle success and error responses.
        req.setSuccessHandler(successHandler);
        req.send();
    };

    // This call to getFloots() establishes the initial screen before any
    // modifications to the server
    getFloots();

    /**
     * successHandler
     * --------------
     * create the MainComponent after a getFloots() request
     *
     * The success Handler function is called by getFloots() to create the
     * Main Component with the appropriate current user saved within the
     * Flutterer function, Floots, and action functins for other components
     * to call.
     *
     * @param response: info passed from the ASYNC REQUEST to the sever
     */
    function successHandler(response) {
        let payload = response.getPayload();
        floots = JSON.parse(payload);
        while (document.body.lastChild !== null) {
            document.body.removeChild(document.body.lastChild);
        }
        document.body.appendChild(MainComponent(user, floots, actions));
    };

}

/**
 * Component: MainComponent
 * ------------------------
 * Constructs all the elements that make up the page.
 *
 * Parameters:
 *   * selectedUser: username of the logged-in user (string)
 *   * floots: an array of floot aggregates/objects that make up the news feed
 *   * actions: an aggregate containing a variety of functions that can be used
 *     to change the page or send data to the server (e.g. change the currently
 *     logged-in user, delete floots, etc.)
 *   * selectedFloot: a parameter that contains the floot object that
 *     should be displayed in a modal, or null if no floot has been clicked and
 *     the modal should not be displayed
 *
 * Returns a node with the following structure:
 *   <div class="primary-container">
 *       <Sidebar />
 *       <NewsFeed />
 *   </div>
 */
function MainComponent(selectedUser, floots, actions, selectedFloot=null) {

    let container = document.createElement("div");
    container.classList.add("primary-container");
    container.appendChild(Sidebar(USERS, selectedUser, actions));
    container.appendChild(NewsFeed(selectedUser, floots, actions));
    if (selectedFloot !== null) {
        container.appendChild(FlootModal(selectedFloot, selectedUser, actions));
    }
    return container;
}

/**
 * NOTE TO STUDENTS: you don't need to understand anything below.  It's fancy
 * JavaScript we need to help make the development process a little easier.
 *
 * The following code uses some Javascript magic so that all network requests
 * are logged to the browser console. You can still view all network requests
 * in the Network tab of the browser console, and that may be more helpful (it
 * provides much more useful information), but students may find this handy for
 * doing quick debugging.
 */
(() => {
    function log_info(msg, ...extraArgs) {
        console.info("%c" + msg, "color: #8621eb", ...extraArgs);
    }
    function log_success(msg, ...extraArgs) {
        console.info("%c" + msg, "color: #39b80b", ...extraArgs);
    }
    function log_error(msg, ...extraArgs) {
        console.warn("%c" + msg, "color: #c73518", ...extraArgs);
    }
    const _fetch = window.fetch;
    window.fetch = function(...args) {
        log_info(`Making async request to ${args[1].method} ${args[0]}...`);
        return new Promise((resolve, reject) => {
            _fetch(...args).then((result) => {
                const our_result = result.clone();
                our_result.text().then((out_text) => {
                    if (our_result.ok) {
                        log_success(`Server returned successful response for ${our_result.url}`);
                    } else {
                        log_error(`Server returned Error ${our_result.status} `
                            + `(${our_result.statusText}) for ${our_result.url}`,
                            out_text);
                    }
                    resolve(result);
                });
            }, (error) => {
                log_error('Error!', error);
                reject(error);
            });
        });
    };

    log_info("Did you know?", "For this assignment, we have added some code that "
        + "logs network requests in the JS console. However, the Network tab "
        + "has even more useful information. If you are having problems with API "
        + "calls, the Network tab may be a good place to check out; you can see "
        + "POST request bodies, full server responses, and anything else you might "
        + "desire there.");
})();

document.addEventListener("DOMContentLoaded", Flutterer);
