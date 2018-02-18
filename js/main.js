//If this change update utils.php
var LEVELS = Object.freeze({"Inactive":-1, "Admin":0, "User":1});
var LEVELS_STRINGS = ["Inactive", "Admin", "User"];
var PointsType = Object.freeze({"th":0, "sum":1, "abs":2, "or":3, "and":4});
var sessionId = "";
var userLevel = LEVELS.Inactive;
var username = "";

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
    //split hash
    let tokens = newHash.split('-');
    let operation = tokens[0].replace("#", "");

    switch (operation) {
        //with admin and css
        case "admuser":
            LoadInContainerIfAdmin(operation);
            break;
        //with admin and no css
        case "admrounds":
        case "admsettings":
        case "admmatches":
            LoadInContainerIfAdmin(operation, false);
            break;
        //everyone with css and no params
        case "hexmap":
            LoadInContainer(operation);
            break;
        //everyone with no css and no params
        case "upcoming":
        case "recent":
        case "forces":
        case "rules":
        case "ranking":
        case "usrprofile":
            LoadInContainer(operation, false);
            break;
        //everyone with no css and params
        case "match":
        case "user":
            LoadInContainer(operation, false, tokens[1]);
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

function LoadInContainer(item, css = true, param = null){
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
            LoadScript(item, param);
        }
    });
}

function LoadInContainerIfAdmin(item, css = true, param = null){
    if (userLevel === LEVELS.Admin){
        LoadInContainer(item, css, param);
    }
    else {
        LoadHome();
    }
}

function LoadScript(item, param){
    $.getScript('./js/'+item+'.js', function( data, textStatus, xhr ) {
        if ( status == "error" ) {
            var msg = "Sorry but there was an error on js load: ";
            $( "#container" ).html( msg + xhr.status + " " + xhr.statusText );
        }
        else {
            /* Then Run */
            window[item+'OnLoad'](param);
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

function GetSessionId(){
    return sessionId;
}

/* common editor */
var editorInited;

function EditorFill(data){
    if (editorInited){
        tinymce.activeEditor.setContent(data);
    }
    else {
        setTimeout(function() { EditorFill(data); }, 100);
    }
}

function AddEditor(textArea){
    editorInited = false;
    tinymce.remove();
    var initData = {
        selector: textArea,
        height: 500,
        menubar: false,
        plugins: [
        'advlist autolink lists link image charmap print preview anchor textcolor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code help wordcount'
        ],
        toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css']
    };
    tinymce.init(initData);

    tinymce.activeEditor.on('init',function(){
        editorInited = true;
    });
}