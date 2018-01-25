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
                var response = JSON.parse(data);
                if (response.status === "OK"){
                    AdmUserLog('User: ' + values['username'] + ' correctly created');
                    AdmUserInit();
                }
                else {
                    AdmUserLog(response.status);
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
                '<label for="userSelector" class="form-label-sm">Users to be deleted</label>'+
                '<select multiple class="form-control" id="userSelector">';

    for (var user of users){
        html +=     '<option>'+user.name+'</option>';
    }

    html +=
                '</select>'+
            '</div>'+
            '<button type="submit" class="btn btn-dark">Confirm</button>'+
        '</form>';
    
    div.html(html);

    $("#deleteUserForm").submit(function(e){
        form = $('#deleteUserForm option:selected');
        
        var values = {};
        values.session = sessionId;
        values.users = new Array();
        form.each(function() {
            values.users.push(this.value);
        });

        var text = "Are you sure to delete the following users?<ul>";
        $(values.users).each(function() {
            text += "<li>" + this + "</li>";
        });
        text += "</ul>Once applied this cannot be undone."
        $('#ModalLabel').html("Confirm deletion");
        $('#modalBody').html(text);
        $('#modalFooter').html(
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
            '<button type="button" class="btn btn-primary" id="modalConfirm" data-dismiss="modal">Apply</button>'
        );
        $('#modalConfirm').click(function(){
            $.post("./php/userdelete.php", JSON.stringify(values), function(data, status, xhr){
                if (status == "error"){
                    //handle failure
                    AdmUserLog('Unable to contact server');
                }
                else {
                    var response = JSON.parse(data);
                    if (response.status === "OK"){
                        AdmUserLog("Users correctly deleted");
                        AdmUserInit();
                    }
                    else {
                        AdmUserLog(response.status);
                    }
                }
            }).fail(function(){ 
                // Handle error here
                AdmUserLog('Unable to complete request. 404?');
            });
        });
        $('#myModal').modal('show');
        e.preventDefault();
    });
}

function FillLevel(users){
    var div = $('#manageUserDiv');
    var html = 
        '<form id="manageUserForm">'+
            '<div class="form-group">';
    var counter = 1;
    for (var user of users){
        html +=
                ((counter) ? '<div class="row listUser" style="background-color: #ebebeb;">' : '<div class="row listUser">')+
                    '<label for="select'+user.name+'" class="col-sm-8 col-form-label-sm" style="margin-bottom: 0px !important;">'+user.name+'</label>'+
                    '<div class="col-sm-4">'+
                        '<select id="select'+user.name+'" class="form-control-sm">';

        for (var level of LEVELS_STRINGS){
            html +=
                    ((Number(user.level) === LEVELS[level]) ? '<option selected>' : '<option>')+level+'</option>';
        }
        html +=
                        '</select>'+
                    '</div>'+
                '</div>';
            counter = !counter;
        }

    html +=
            '</div>'+                
            '<button type="submit" class="btn btn-dark">Confirm</button>'+
        '</form>';
    
    div.html(html);

    $("#manageUserForm").submit(function(e){
        form = $('#manageUserForm :input');
        var values = {};
        values.users = new Array();
        form.each(function() {
            values.users.push({"level": this.value, "name": "pippo"});
        })

        e.preventDefault();
    });
}