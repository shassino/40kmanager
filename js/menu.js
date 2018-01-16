function OnLoadMenu() {
    $('#loginForm').submit(function(e){
        form = $('#loginForm :input');
        var values = {};
        form.each(function() {
            values[this.name] = this.value;
        })

        //$.post("./php/login.php",

        

        e.preventDefault();
    });
};