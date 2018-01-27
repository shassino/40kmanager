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
            LoadInContainerIfAdmin("admuser");
            break;
        case "#admsettings":
            LoadInContainerIfAdmin("admsettings", false);
            break;
        case "#admmatches":
            LoadInContainerIfAdmin("admmatches", false);
            break;
        case "#hexmap":
            LoadInContainer("hexmap");
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
            LoadCss('menu');
            LoadScript('menu');
        }
    });
}

function LoadHome(){
    LoadInContainer("home");
}

function LoadInContainer(item, css = true){
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
                LoadCss(item);
            }
            LoadScript(item);
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on html load");
    });
}

function LoadInContainerIfAdmin(item, css = true){
    if (userLevel === LEVELS.Admin){
        LoadInContainer(item, css);
    }
    else {
        LoadHome();
    }
}

function LoadScript(item){
    $.getScript('./js/'+item+'.js', function( data, textStatus, xhr ) {
        if ( status == "error" ) {
            var msg = "Sorry but there was an error on js load: ";
            $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            window[item+'OnLoad']();
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on js load");
    });
}

function LoadCss(item){
    $.ajax({
        url: './style/'+item+'.css',
        dataType: 'css',
        success: function(){                  
            $('<link rel="stylesheet" type="text/css" href="./style/'+item+'.css" />').appendTo("head");
        },
        error: function(){
            $( "#container" ).html("Error on css load");
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on css load");
    });
}