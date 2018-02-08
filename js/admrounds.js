var rounds;

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
            rounds = response.rounds;
            FillUserListDiv();
        });
    });


    $('#addUsersButton').click(function(){
        var request = {};
        request.session = GetSessionId();
        request.operation = "adduser";
        request.users = new Array();
        request.rounds = new Array();

        form = $('#userSelector option:selected');
        form.each(function() {
            request.users.push(this.value);
        });

        form = $('#roundSelector option:selected');
        form.each(function() {
            request.rounds.push(this.value);
        });

        RequestData("./php/rounds.php", request, function(response){
            AppendLog("Users added correctly");
            FillUserListDiv();
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

function FillUserListDiv(){
    $('#userPerRoundsDiv').html("");
    var request = {};
    request.session = GetSessionId();
    request.operation = "listusers";
    for (let round of rounds){
        request.round = round;
        RequestData("./php/rounds.php", request, function(response){
            let round = response.rounds[0];
            let html = 
                '<div class="form-group">'+
                    '<label for="round'+round+'Selector" class="form-label-sm">'+round+'</label>'+
                    '<select multiple class="form-control" id="round'+round+'Selector" style="overflow-y: auto !important; height: ' + (14 + 22 * response.users.length) + 'px;">';
            
            for (let user of response.users){
                html += '<option>'+user+'</option>';
            }
            html +=
                    '</select>'+
                '</div>';

            $('#userPerRoundsDiv').append(html);
        });
    }
    $('#delUsersButton').click(function(){
        var request = {};
        request.session = GetSessionId();
        request.operation = "delusers";
        request.rounds = new Array();
        for (let round of rounds){
            let newRound = {};
            newRound.users = new Array();
            newRound.name = round;
            form = $('#round'+round+'Selector option:selected');
            form.each(function() {
                newRound.users.push(this.value);
            });
            request.rounds.push(newRound);
        }
        RequestData("./php/rounds.php", request, function(response){
            AppendLog("Users deleted correctly");
            FillUserListDiv();
        });
    });
}
//# sourceURL=./js/admrounds.js
