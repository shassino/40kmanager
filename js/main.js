function main(){
    LoadToolBar();
    LoadHexMap();
}

function LoadToolBar(){
    /* First fill container html */
    $("#toolbar").load("./html/menu.html");

    /* Run Map */
    /*InitHexMap();*/
}

function LoadHexMap(){
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