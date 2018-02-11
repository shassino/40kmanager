function GetCurrentChampionship(OnLoad){
    let request = {};
    request.operation = "getcurrent";
    request.session = GetSessionId();
    RequestData("./php/championship.php", request, function(response){
        OnLoad(response);
    });
}

function GetChampionshipRounds(championship, OnLoad){
    let request = {};
    request.session = GetSessionId();
    request.operation = "list";
    request.championship = championship;
    RequestData("./php/rounds.php", request, function(response){
        OnLoad(response);
    });
}

function GetRoundUsers(round, OnLoad){
    var request = {};
    request.session = GetSessionId();
    request.operation = "listusers";
    request.round = round;
    RequestData("./php/rounds.php", request, function(response){
        OnLoad(response);
    });
}

function GetUserMatches(user, OnLoad){
    var request = {};
    request.session = GetSessionId();
    request.operation = "player";
    request.player = user;
    RequestData("./php/matches.php", request, function(response){
        OnLoad(response);
    });
}

function GetRoundMatches(round, OnLoad){
    var request = {};
    request.session = GetSessionId();
    request.operation = "round";
    request.round = round;
    RequestData("./php/matches.php", request, function(response){
        OnLoad(response);
    });
}

function CalcRankings(OnLoad){
    var rankings = {};
    var rank = {};
    rank.counter = 0;

    rankings.rounds = [];
    rank.counter += 1;
    GetCurrentChampionship(function(champ){
        rank.counter += 1;
        GetChampionshipRounds(champ.name, function(response){
            for (round of response.rounds){
                rank.counter += 1;
                let newRound = {};
                newRound.users = [];
                newRound.name = round;
                rankings.rounds[newRound.name] = newRound;
                GetRoundMatches(round, function(response){
                    /*
                    response.matches[].p1
                    response.matches[].p2
                    response.matches[].day
                    response.matches[].obj1
                    response.matches[].obj2
                    response.matches[].sec1
                    response.matches[].sec2
                    response.matches[].lost1
                    response.matches[].lost2
                    response.matches[].res1
                    response.matches[].res2
                    response.matches[].report
                    response.matches[].played
                    response.matches[].matchId
                    response.matches[].round
                    */
                    for (match of response.matches){
                        let round = rankings.rounds[match.round];
                        if (round.users[match.p1] == undefined){
                            let newUser = {}
                            newUser.name = match.p1;
                            newUser.points = 0;
                            round.users[newUser.name] = newUser;
                        }
                        round.users[match.p1].points += Number(match.res1);

                        if (round.users[match.p2] == undefined){
                            let newUser = {}
                            newUser.name = match.p2;
                            newUser.points = 0;
                            round.users[newUser.name] = newUser;
                        }
                        round.users[match.p2].points += Number(match.res2);
                    }
                    rank.counter -= 1;
                });
            }
            rank.counter -= 1;
        });
        rank.counter -= 1;
    });

    SetCounterCallback(rank, function(){
        /* sort rankings */
        for (round of rankings.rounds){
            round.users.sort(function(a, b){
                return b.points - a.points;
            })
        }

        OnLoad(rankings);
    });
}

function SetCounterCallback(param, OnLoad){
    if (param.counter === 0){
        OnLoad(param);
    }
    else {
        setTimeout(function(){
            SetCounterCallback(param, OnLoad);
        }, 10);
    }
}

function GetPlayedMatches(OnLoad){
    let request = {};
    request.operation = "list";

    let played = [];

    RequestData("./php/matches.php", request, function(response){
        for (match of response.matches){
            if (match.played !== "0000-00-00 00:00:00"){
                played.push(match);
            }
        }

        played.sort(function(a, b){
            if (a.played === b.played){
                return 0;
            }
            if (a.played < b.played){
                return -1;
            }
            if (a.played > b.played){
                return 1;
            }
        });

        OnLoad(played);
    });
}

function GetNotPlayedMatches(OnLoad){
    let request = {};
    request.operation = "list";

    let notPlayed = [];
    
    RequestData("./php/matches.php", request, function(response){
        for (match of response.matches){
            if (match.played === "0000-00-00 00:00:00"){
                notPlayed.push(match);
            }
        }

        OnLoad(notPlayed);
    });
}