var FACTIONS = Object.freeze({
    "Space Marines": 0,
    "Ultramarines": 1,
    "Blood Angels": 2,
    "Dark Angels": 3,
    "Deathwatch": 4,
    "Grey Knights": 5,
    "Space Wolves": 6,
    "Astra Militarum": 7,
    "Adeptus Ministorum": 8,
    "Adeptus Custodes": 9,
    "Sisters of Silence": 10,
    "Adeptus Mechanicus": 11,
    "Inquisition": 12,
    "Imperial Knights": 13,
    "Officio Assassinorum": 14,
    "Chaos Space Marines": 15,
    "Death Guard": 16,
    "Thousand Sons": 17,
    "Renegade Knights": 18,
    "Chaos Daemons": 19,
    "Orks": 20,
    "Harlequins": 21,
    "Ynnari": 22,
    "Necrons": 23,
    "T'au Empire": 24,
    "Tyranids": 25,
    "Genestealer Cults": 26,
    "Craftworlds": 27,
    "Drukhari": 28
});

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
            for (let round of response.rounds){
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
                            newUser.played = 0;
                            newUser.won = 0;
                            newUser.tie = 0;
                            newUser.lost = 0;
                            round.users[newUser.name] = newUser;
                        }
                        
                        if (round.users[match.p2] == undefined){
                            let newUser = {}
                            newUser.name = match.p2;
                            newUser.points = 0;
                            newUser.played = 0;
                            newUser.won = 0;
                            newUser.tie = 0;
                            newUser.lost = 0;
                            round.users[newUser.name] = newUser;
                        }

                        if ((Number(match.res1) !== 0) && (Number(match.res2) !== 0)){
                            //played match
                            round.users[match.p1].points += Number(match.res1);
                            round.users[match.p2].points += Number(match.res2);

                            round.users[match.p1].played += 1;
                            round.users[match.p2].played += 1;

                            if (Number(match.res1) > Number(match.res2)){
                                round.users[match.p1].won += 1;
                                round.users[match.p2].lost += 1;
                            }
                            else if (Number(match.res1) < Number(match.res2)){
                                round.users[match.p1].lost += 1;
                                round.users[match.p2].won += 1;
                            }
                            else {
                                round.users[match.p1].tie += 1;
                                round.users[match.p2].tie += 1;
                            }
                        }
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
        for (key in rankings.rounds){
            let round = rankings.rounds[key];

            let sortable = new Array()
            for (key in round.users){
                let user = round.users[key];
                sortable.push(user);
            }

            sortable.sort(function(a, b){
                return b.points - a.points;
            })

            round.users = sortable;
        }

        OnLoad(rankings);
    });
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

function ModalSetLabel(html){
    $('#ModalLabel').html(html);
}

function ModalSetBody(html){
    $('#modalBody').html(html);
}

function ModalSetFooter(html){
    $('#modalFooter').html(html);
}

function ModalShow(){
    $('#myModal').modal('show');
}