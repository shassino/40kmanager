function OnLoadMenu() {
    $('#loginForm').submit(function(e){
        form = $('#loginForm :input');
        var values = {};
        form.each(function() {
            if (this.name !== ""){
                values[this.name] = this.value;
            }
        })

        $.post("./php/login.php", JSON.stringify(values), function(data,status,xhr) {
            //handle failure
            console.log(status);
            //do something on success
        });

        e.preventDefault();
    });
};