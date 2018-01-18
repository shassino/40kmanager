var sessionId = "";

function OnLoadMenu() {
    LoadLoginDropdown(); //Fill login dropdown
};

function LoadLoginDropdown(){
    $("#loginDropdown").html(
        '<form class="px-4 py-3" id="loginForm" method="post" action="login.php" role="form">'+
            '<div class="form-group">'+
                '<label for="InputUsername">Username</label>'+
                '<input type="text" name="username" class="form-control" id="InputUsername" placeholder="Username">'+
            '</div>'+
            '<div class="form-group">'+
                '<label for="InputPassword">Password</label>'+
                '<input type="password" name="password" class="form-control" id="InputPassword" placeholder="Password">'+
            '</div>'+
            '<button type="submit" class="btn btn-dark">Confirm</button>'+
        '</form>'
    );

    $('#loginForm').submit(function(e){
        form = $('#loginForm :input');
        var values = {};
        form.each(function() {
            if (this.name !== ""){
                values[this.name] = this.value;
            }
        })

        $.post("./php/login.php", JSON.stringify(values), function(data, status, xhr){
            if (status == "error"){
                //handle failure
                console.log(status);
                LoadLoginFailedDropdown();
            }
            else {
                sessionId = data;
                LoadLogoutDropdown(values["username"]);
            }
        });

        e.preventDefault();
    });
}

function LoadLoginFailedDropdown(){
    LoadLoginDropdown();
    $("#loginDropdown").append("<br>Username or password invalid");
}

function LoadLogoutDropdown(username){
    $("#loginDropdown").html(
        '<div style="padding-left: 10px;">'+
            '<p>Logged as: ' + username + '</p>'+
            '<button type="button" id="logoutButton" class="btn btn-dark">Logout</button>'+
        '</div>');//do something on success

    $("#logoutButton").click(function(){
        alert("clicked logout");
    })
}