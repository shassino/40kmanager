//If this change update utils.php
var LEVELS = Object.freeze({"Inactive":-1, "Admin":0, "User":1});
var LEVELS_STRINGS = ["Inactive", "Admin", "User"];
var sessionId = "";
var userLevel = LEVELS.Inactive;

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
    LoadCss('menu');
    /* First fill container html */
    $("#toolbar").load("./html/menu.html", function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Run Menu */
            LoadScript('menu');
        }
    });
}

function LoadHome(){
    LoadInContainer("home");
}

function LoadInContainer(item, css = true){
    UpdateHash('#'+item);
    if (css){
        LoadCss(item);
    }
    /* First fill container html */
    $("#container").load('./html/'+item+'.html', function( response, status, xhr ) {
        if ( status == "error" ) {
          var msg = "Sorry but there was an error on html load: ";
          $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            LoadScript(item);
        }
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
        /*dataType: 'css',*/
        success: function(){                  
            $('<link rel="stylesheet" type="text/css" href="./style/'+item+'.css" />').appendTo("head");
        },
        error: function(xhr, status, error){
            $( "#container" ).html("Error on css load");
        }
    })
    .fail(function(){
        $( "#container" ).html("Fail on css load");
    });
}

function RequestData(url, request, OnLoad){
    $.post(url, JSON.stringify(request), function(data, status, xhr){
        if (status == "error"){
            //handle failure
            AppendLog('Unable to contact server');
        }
        else {
            var response = JSON.parse(data);
            if (response.status === "OK"){
                if (OnLoad != null){
                    OnLoad(response);
                }
            }
            else {
                AppendLog(response.status);
            }
        }
    }).fail(function(){ 
        // Handle error here
        AppendLog('Unable to complete request. 404?');
    });
}

function AppendLog(log){
    $("#logDiv").append("<p>"+log+"</p>");
}