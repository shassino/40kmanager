var hash = "#"; /* current hash of the page */

$(function(){
    LoadToolBar();

    LocationSwitch(window.location.hash);
});

$(window).on('hashchange', function() {
    if (hash !== window.location.hash){
        LocationSwitch(window.location.hash);
    }
});

function LocationSwitch(newHash) {
    switch (newHash) {
        case "#hexmap":
            LoadHexMap();
            break;

        case "#home":
            LoadHome();
            break;

        default:
            LoadHome();
            break;
    }
}

function UpdateHash(newHash){
    hash = newHash;
    window.location.hash = newHash;
}

function LoadToolBar(){
    /* First fill container html */
    $("#toolbar").load("./html/menu.html", function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Run Menu */
            OnLoadMenu();
        }
    });
}

function LoadHexMap(){
    UpdateHash("#hexmap");
    /* First fill container html */
    $("#container").load("./html/hexmap.html", function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Run Map */
            InitHexMap();
        }
    });
}

function LoadHome(){
    UpdateHash("#home");
    /* First fill container html */
    $("#container").load("./html/home.html", function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Run Home */
            /* InitHome(); */
        }
    });
}