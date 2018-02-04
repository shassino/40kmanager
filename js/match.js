function matchOnLoad(matchId){
    let request = {};
    request.operation = "single";
    request.session = GetSessionId();
    request.matchId = matchId;

    RequestData("./php/matches.php", request, function(response){
        FillMatch(response);
    });

    if (userLevel === LEVELS.Admin){
        EnableAdminPanel();
    }
}

function FillMatch(response){
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
    request.operation = "get";
    request.session = GetSessionId();
    request.name = response.day;

    RequestData("./php/days.php", request, function(response2){
        let match = response.matches;
        let html = 
        '<p>Championship: '+response2.championship+'</p>'+
        '<p>Day: '+response2.day+'</p>'+
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
            '</tr>'+
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
            '</tr>'+
        '</table>'
        $("#resultDiv").html(html);
    });
}

function EnableAdminPanel(){

}