function admuserOnLoad(){
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

        RequestData("./php/register.php", values, function(response){
            AppendLog('User: ' + values['username'] + ' correctly created');
            AdmUserInit();
        });

        e.preventDefault();
    });
}

function AdmUserInit(){
    //request the user list with level
    var request = {};
    request.session = GetSessionId();
    request.operation = "listWithLev";
    
    RequestData("./php/users.php", request, function(response){
        FillDelete(response.users);
        FillLevel(response.users);
    });
}

function FillDelete(users){
    var div = $("#deleteUserDiv");
    var html =
        '<form id="deleteUserForm">'+
            '<div class="form-group">'+
                '<label for="userSelector" class="form-label-sm">Users to be deleted</label>'+
                '<select multiple class="form-control" id="userSelector" style="overflow-y: auto !important; height: ' + (14 + 22 * users.length) + 'px;">';

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
        ModalSetLabel("Confirm deletion");
        ModalSetBody(text);
        ModalSetFooter(
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
            '<button type="button" class="btn btn-primary" id="modalConfirm" data-dismiss="modal">Apply</button>'
        );
        $('#modalConfirm').click(function(){
            RequestData("./php/userdelete.php", values, function(response){
                AppendLog("Users correctly deleted");
                AdmUserInit();
            });
        });
        ModalShow();
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
                    '<label for="select'+user.name+'" class="col-sm-7 col-form-label-sm" style="margin-bottom: 0px !important; width: 100% !important;">'+user.name+'</label>'+
                    '<div class="col-sm-5">'+
                        '<select id="select'+user.name+'" name="'+user.name+'" class="form-control-sm" style="width: 100% !important;">';

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
        form = $('#manageUserForm select:input');
        var request = {};
        request.session = sessionId;
        request.operation = "setlevel";
        request.users = new Array();
        form.each(function() {
            request.users.push({"level": LEVELS[this.value], "name": this.name});
        });

        RequestData("./php/users.php", request, function(response){
            AdmUserInit();
            AppendLog("Users levels correctly applied");
        });
        
        e.preventDefault();
    });
}