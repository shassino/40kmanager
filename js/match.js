function matchOnLoad(matchId){
    var request = {};
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

}

function EnableAdminPanel(){
    
}