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
            LoadInContainerIfAdmin("admuser", OnAdmUserLoad);
            break;
        case "#admsettings":
            LoadInContainerIfAdmin("admsettings", OnAdmSettingsLoad, false);
            break;
        case "#admmatches":
            LoadInContainerIfAdmin("admmatches", OnAdmMatchesLoad, false);
            break;
        case "#hexmap":
            LoadInContainer("hexmap", InitHexMap);
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
            LoadCss('./style/menu.css')
            LoadScript('./js/menu.js', OnLoadMenu);
        }
    });
}

function LoadHome(){
    LoadInContainer("home", InitHome);
}

function LoadInContainer(item, OnLoad, css = true){
    UpdateHash('#'+item);
    /* First fill container html */
    $("#container").load('./html/'+item+'.html', function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error on html load: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            if (css){
                LoadCss('./style/'+item+'.css')
            }
            LoadScript('./js/'+item+'.js', OnLoad);
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on html load");
    });
}

function LoadInContainerIfAdmin(item, OnLoad, css = true){
    if (userLevel === LEVELS.Admin){
        LoadInContainer(item, OnLoad, css);
    }
    else {
        LoadHome();
    }
}

function LoadScript(url, OnLoad){
    $.getScript(url, function( data, textStatus, xhr ) {
        if ( status == "error" ) {
            var msg = "Sorry but there was an error on js load: ";
            $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            OnLoad();
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on js load");
    });
}

function LoadCss(href){
    $.ajax({
        url: href,
        dataType: 'css',
        success: function(){                  
            $('<link rel="stylesheet" type="text/css" href="'+href+'" />').appendTo("head");
        },
        error: function(){
            $( "#container" ).html("Error on css load");
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on css load");
    });
}