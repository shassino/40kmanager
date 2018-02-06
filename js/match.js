var matchId;
function matchOnLoad(param){
    matchId = param;
    
    FillMatch();
    FillReport();

    if (userLevel === LEVELS.Admin){
        $('#logCard').removeClass("hidden");
        $('#reportFooter').removeClass("hidden");

        $('#saveReport').click(function(){
            var request = {};
            request.session = GetSessionId();
            request.operation = 'report';
            request.matchId = matchId;
            request.report = tinymce.activeEditor.getContent();

            RequestData("./php/matches.php", request, function(response){
                AppendLog("Report saved");         
            });
        });
    }
}

function FillReport(){
    let request = {};
    request.operation = "single";
    request.session = GetSessionId();
    request.matchId = matchId;
    RequestData("./php/matches.php", request, function(response){
        if (userLevel === LEVELS.Admin){
            AddEditor('#reportTextArea');
            EditorFill(response.matches[0].report);
        }
        else {
            $('#reportDiv').html(response.matches[0].report);
        }
    });
}

function FillMatch(){
    let request = {};
    request.operation = "single";
    request.session = GetSessionId();
    request.matchId = matchId;
    RequestData("./php/matches.php", request, function(response){
        /*
        response.p1
        response.p2
        response.day
        response.obj1
        response.obj2
        response.lost1
        response.lost2
        response.report
        response.played
        response.matchId
        */
        let request = {};
        let match = response.matches[0];
        request.operation = "get";
        request.session = GetSessionId();
        request.name = match.day;

        RequestData("./php/days.php", request, function(response2){
            let html = 
            '<p><b>Championship: </b>'+response2.championship+'</p>'+
            '<p><b>Day: </b>'+response2.day+'</p>';
            html +=
            '<table class="table">'+
                '<tr class="title">'+
                    '<td class="cell"></td>'+
                    '<td class="cell">Host</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">Guest</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="cell">Player</td>'+
                    '<td class="cell">'+match.p1+'</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">'+match.p2+'</td>'+
                '</tr>';
            if (userLevel === LEVELS.Admin){
                html +=
                '<tr>'+
                    '<td class="cell">Objectives</td>'+
                    '<td class="cell">'+
                        '<input type="number" class="form-control" id="inputObj1" value="'+match.obj1+'">'+
                    '</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">'+
                        '<input type="number" class="form-control" id="inputObj2" value="'+match.obj2+'">'+
                    '</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="cell">Points lost</td>'+
                    '<td class="cell">'+
                        '<input type="number" class="form-control" id="inputLost1" value="'+match.lost1+'">'+
                    '</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">'+
                        '<input type="number" class="form-control" id="inputLost2" value="'+match.lost2+'">'+
                    '</td>'+
                '</tr>';
            }
            else {
                html +=
                '<tr>'+
                    '<td class="cell">Objectives</td>'+
                    '<td class="cell">'+match.obj1+'</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">'+match.obj2+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td class="cell">Points lost</td>'+
                    '<td class="cell">'+match.lost1+'</td>'+
                    '<td class="cell">-</td>'+
                    '<td class="cell">'+match.lost2+'</td>'+
                '</tr>';
            }
            html += '</table>';
            if (userLevel === LEVELS.Admin){
                html += '<button type="button" id="saveMatch" class="btn btn-dark">Save</button>';
            }
            $("#resultDiv").html(html);

            if (userLevel === LEVELS.Admin){
                $('#saveMatch').click(function(){
                    let request = {};
                    request.operation = "result";
                    request.session = GetSessionId();
                    request.matchId = matchId;
                    request.obj1 = $('#inputObj1').val();
                    request.obj2 = $('#inputObj2').val();
                    request.lost1 = $('#inputLost1').val();
                    request.lost2 = $('#inputLost2').val();
                    RequestData("./php/matches.php", request, function(response){
                        AppendLog("Result updated");
                        FillMatch();
                    }); 
                }); 
            }
        });
    });
}

function EnableAdminPanel(){

}

//# sourceURL=./js/match.js
