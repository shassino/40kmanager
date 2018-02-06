function admroundsOnLoad(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "list";
    
    RequestData("./php/users.php", request, function(response){
        FillUsersSelector(response.users);
    });

    request.operation = "getcurrent";
    RequestData("./php/championship.php", request, function(response){
        request.operation = "list";
        request.championship = response.name;
        RequestData("./php/rounds.php", request, function(response){
            FillRoundsSelector(response.rounds);
        });
    });
}

function FillUsersSelector(users){
    var html =
        '<div class="form-group">'+
            '<label for="userSelector" class="form-label-sm">Users selector</label>'+
            '<select multiple class="form-control" id="userSelector" style="overflow-y: auto !important; height: ' + (14 + 22 * users.length) + 'px;">';

    for (var user of users){
        html += '<option>'+user+'</option>';
    }

    html +=
            '</select>'+
        '</div>';
    
    $("#selectUsersDiv").html(html);
}

function FillRoundsSelector(rounds){
    var html =
        '<div class="form-group">'+
            '<label for="roundSelector" class="form-label-sm">Rounds selector</label>'+
            '<select multiple class="form-control" id="roundSelector" style="overflow-y: auto !important; height: ' + (14 + 22 * rounds.length) + 'px;">';

    for (var round of rounds){
        html += '<option>'+round+'</option>';
    }

    html +=
            '</select>'+
        '</div>';
    
    $("#selectRoundsDiv").html(html);
}
//# sourceURL=./js/admrounds.js
