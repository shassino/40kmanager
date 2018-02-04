function menuOnLoad() {
    LoadLoginDropdown(); //Fill login dropdown
    DisableAdmin();
};

function LoadLoginDropdown(){
    $("#loginDropdown").html(
        '<form class="px-4 py-3" id="loginForm" method="post" action="login.php" role="form">'+
            '<div class="form-group">'+
                '<label for="InputUsername">Username</label>'+
                '<input type="text" name="username" class="form-control" id="InputUsername" placeholder="Enter username">'+
            '</div>'+
            '<div class="form-group">'+
                '<label for="InputPassword">Password</label>'+
                '<input type="password" name="password" class="form-control" id="InputPassword" placeholder="Enter password">'+
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
                LoadLoginFailedDropdown("Unable to contact server");
            }
            else {
                response = JSON.parse(data);
                if (response.status != "OK"){
                    LoadLoginFailedDropdown(response.status);
                }
                else {
                    sessionId = response.session;
                    userLevel = Number(response.level);
                    LoadLogoutDropdown(values["username"]);
                    $("#navbarLoginDropdown").click();
                    if (userLevel === LEVELS.Admin){
                        //Enable Admin menu
                        EnableAdmin();
                    }
                }
            }
        });

        e.preventDefault();
    });
}

function LoadLoginFailedDropdown(error){
    LoadLoginDropdown();
    $("#loginDropdown").append(
        '<div style="padding-left: 10px; padding-right: 10px;">'+
            '<p>' + error + '</p>'+
        '</div>'
        );
}

function LoadLogoutDropdown(username){
    $("#loginDropdown").html(
        '<div style="padding-left: 10px;">'+
            '<p>Logged as: ' + username + '</p>'+
            '<button type="button" id="logoutButton" class="btn btn-dark">Logout</button>'+
        '</div>');//do something on success

    $("#logoutButton").click(function(){
        var values = {};
        values["session"] = sessionId;

        $.post("./php/logout.php", JSON.stringify(values), function(data, status, xhr){
            if (status == "error"){
                //handle failure
                LoadLogoutFailedDropdown("Unable to contact server");
            }
            else {
                if (data.indexOf("OK") >= 0){
                    sessionId = "";
                    userLevel = LEVELS.Inactive;
                    LoadLoginDropdown();
                    DisableAdmin();
                    LoadHome();
                }
                else {
                    LoadLogoutFailedDropdown(data);
                }
            }
        });
    })
}

function LoadLogoutFailedDropdown(error){
    LoadLoginDropdown();
    $("#loginDropdown").append(
        '<div style="padding-left: 10px; padding-right: 10px;">'+
            '<p>' + error + '</p>'+
        '</div>'
        );
}

function EnableAdmin(){
    $("#adminMenuItem").removeClass("hidden");
}

function DisableAdmin(){
    $("#adminMenuItem").addClass("hidden");
}