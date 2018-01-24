function OnAdmUserLoad(){
    AdmUserInit();

    $('#createUserForm').submit(function(e){
        form = $('#createUserForm :input');
        var values = {};
        form.each(function() {
            if (this.name !== ""){
                values[this.name] = this.value;
            }
        })
        values.session = GetSessionId();

        $.post("./php/register.php", JSON.stringify(values), function(data, status, xhr){
            if (status == "error"){
                //handle failure
                AdmUserLog('Unable to contact server');
            }
            else {
                if (data.indexOf('OK') >= 0){
                    AdmUserLog('User: ' + values['username'] + ' correctly created');
                    AdmUserInit();
                }
                else {
                    AdmUserLog(data);
                }
            }
        });

        e.preventDefault();
    });
}

function AdmUserInit(){
    //request the user list with level
    var request = {};
    request.session = GetSessionId();
    
    $.post("./php/userlist.php", JSON.stringify(request), function(data, status, xhr){
        if (status == "error"){
            //handle failure
            AdmUserLog('Unable to contact server');
        }
        else {
            var response = JSON.parse(data);
            if (response.status === "OK"){
                FillDelete(response.users);
                FillLevel(response.users);
            }
            else {
                AdmUserLog(response.status);
            }
        }
    });
}

function AdmUserLog(text){
    //TODO save on db
    $("#logDiv").append('<p>' + text + '</p>');
}

function FillDelete(users){
    var div = $("#deleteUserDiv");
    var html =
        '<form id="deleteUserForm">'+
            '<div class="form-group">'+
                '<label for="userSelector">Users to be deleted</label>'+
                '<select multiple class="form-control" id="userSelector">';

    for (var user of users){
        html +=     '<option>'+user.name+'<option>';
    }

    html +=
                '</select>'+
            '</div>'+
            '<button type="submit" class="btn btn-dark">Confirm</button>'+
        '</form>';
    
    div.html(html);

    $("#deleteUserForm").submit(function(e){
        form = $('#deleteUserForm :input');
        var values = {};
        values.users = new Array();
        form.each(function() {
            values.users.append(this.value);
        })

        e.preventDefault();
    });
}

function FillLevel(users){
    var div = $('#manageUserDiv');
    var levels = LEVELS_STRINGS;
    var html = 
        '<form id="manageUserForm">';

    for (var user of users){
        html +=
            '<div class="form-row">'+
                '<div class="form-group col-md-8">'+user.name+'</div>'+
                '<div class="form-group col-md-4">'+
                '<select class="form-control">';

        for (var level of levels){
            html +=
                    ((user.level === level) ? '<option selected>' : '<option>')+level+'</option>';
        }
        html +=
                '</select>'+
            '</div>';
    }

    html +=
            '<button type="submit" class="btn btn-dark">Confirm</button>'+
        '</form>';
    
    div.html(html);

    $("#manageUserForm").submit(function(e){
        form = $('#manageUserForm :input');
        var values = {};
        values.users = new Array();
        form.each(function() {
            values.users.append({"level": this.value, "name": "pippo"});
        })

        e.preventDefault();
    });
}