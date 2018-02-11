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
            '<table class="table table-sm" style="width: 50%;">'+
                '<tbody>'+
                    '<tr>'+
                        '<th scope="row">Championship: </th>'+
                        '<td>'+response2.championship+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th scope="row">Round: </th>'+
                        '<td>'+match.round+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th scope="row">Day: </th>'+
                        '<td>'+response2.day+'</td>'+
                    '</tr>';
            if (match.played != "0000-00-00 00:00:00"){
                html +=
                    '<tr>'+
                        '<th scope="row">Played: </th>'+
                        '<td>'+match.played+'</td>'+
                    '</tr>';
            }
            html +=
                '</tbody>'+
            '</table>';
            html +=
            '<table class="table table-striped">'+
                '<thead>'+
                    '<tr>'+
                        '<th scope="col"></th>'+
                        '<th scope="col">Host</th>'+
                        '<th scope="col">-</th>'+
                        '<th scope="col">Guest</th>'+
                    '</tr>'+
                '<thead>'+
                '<tbody>'+
                    '<tr>'+
                        '<th scope="row">Player</th>'+
                        '<td>'+match.p1+'</td>'+
                        '<td>-</td>'+
                        '<td>'+match.p2+'</td>'+
                    '</tr>';
            if (match.played != "0000-00-00 00:00:00"){
                html +=
                '<tr>'+
                    '<th scope="row">Result</th>'+
                    '<td>'+match.res1+'</td>'+
                    '<td>-</td>'+
                    '<td>'+match.res2+'</td>'+
                '</tr>';
            }
            if (userLevel === LEVELS.Admin){
                html +=
                '<tr>'+
                    '<th scope="row">Primary Objectives</th>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputObj1" value="'+match.obj1+'">'+
                    '</td>'+
                    '<td>-</td>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputObj2" value="'+match.obj2+'">'+
                    '</td>'+
                '</tr>'+
                '<tr>'+
                    '<th scope="row">Secondary Objectives</th>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputSec1" value="'+match.sec1+'">'+
                    '</td>'+
                    '<td>-</td>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputSec2" value="'+match.sec2+'">'+
                    '</td>'+
                '</tr>'+
                '<tr>'+
                    '<th scope="row">Points lost</th>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputLost1" value="'+match.lost1+'">'+
                    '</td>'+
                    '<td>-</td>'+
                    '<td>'+
                        '<input type="number" class="form-control" id="inputLost2" value="'+match.lost2+'">'+
                    '</td>'+
                '</tr>';
            }
            else {
                html +=
                '<tr>'+
                    '<th scope="row">Primary Objectives</th>'+
                    '<td>'+match.obj1+'</td>'+
                    '<td>-</td>'+
                    '<td>'+match.obj2+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<th scope="row">Secondary Objectives</th>'+
                    '<td>'+match.sec1+'</td>'+
                    '<td>-</td>'+
                    '<td>'+match.sec2+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<th scope="row">Points lost</th>'+
                    '<td>'+match.lost1+'</td>'+
                    '<td>-</td>'+
                    '<td>'+match.lost2+'</td>'+
                '</tr>';
            }
            html += '</tbody></table>';
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
                    request.sec1 = $('#inputSec1').val();
                    request.sec2 = $('#inputSec2').val();
                    request.lost1 = $('#inputLost1').val();
                    request.lost2 = $('#inputLost2').val();

                    let result = CalcResult(request);
                    request.res1 = result.pt1;
                    request.res2 = result.pt2;
                    RequestData("./php/matches.php", request, function(response){
                        AppendLog("Result updated");
                        FillMatch();
                    }); 
                }); 
            }
        });
    });
}

function CalcResult(request){
    var response = {};
    if (request.obj1 > request.obj2){
        response.pt1 = 5;
        response.pt2 = 1;
    }
    else if (request.obj1 < request.obj2){
        response.pt1 = 1;
        response.pt2 = 5;
    }
    else {
        if (request.sec1 > request.sec2){
            response.pt1 = 4;
            response.pt2 = 2;
        }
        else if (request.sec2 > request.sec1){
            response.pt1 = 2;
            response.pt2 = 4;
        }
        else {
            response.pt1 = 3;
            response.pt2 = 3;
        }
    }
    return response;
}

//# sourceURL=./js/match.js
