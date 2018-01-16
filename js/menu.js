function OnLoadMenu() {
    $('#loginForm').submit(function(e){
        alert( "Handler for .submit() called." );
        e.preventDefault();
    });
};