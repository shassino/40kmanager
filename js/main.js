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
        case "#admuser":
            LoadInContainerIfAdmin("#admuser", "./html/admuser.html", OnAdmUserLoad);
            break;
        case "#admsettings":
            LoadInContainerIfAdmin("#admsettings", "./html/admsettings.html", OnAdmSettingsLoad);
            break;
        case "#hexmap":
            LoadInContainer("#hexmap", "./html/hexmap.html", InitHexMap);
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

function LoadHome(){
    LoadInContainer("#home", "./html/home.html", InitHome);
}

function LoadInContainer(hash, html, OnLoad){
    UpdateHash(hash);
    /* First fill container html */
    $("#container").load(html, function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            OnLoad();
        }
    });
}

function LoadInContainerIfAdmin(hash, html, OnLoad){
    if (userLevel === LEVELS.Admin){
        LoadInContainer(hash, html, OnLoad);
    }
    else {
        LoadHome();
    }
}
