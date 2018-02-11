function homeOnLoad(){
    let request = {};
    request.operation = "list";

    GetPlayedMatches(function(played){
        FillPlayed(played);
        FillStats(played);
        FillRanking(played);
    });

    GetNotPlayedMatches(function(notPlayed){
        FillUpcoming(notPlayed);
    });
}


function FillPlayed(played){
    let count = 0;
    let html = 
    '<table class="table table-striped">'+
        '<thead>'+
            '<tr>'+
                '<th scope="col">Host</th>'+
                '<th scope="col"></th>'+
                '<th scope="col">Guest</th>'+
                '<th scope="col">View match</th>'+
            '</tr>'+
        '<thead>'+
        '<tbody>';
    for (match of played){
        if (count > 10){
            break;
        }
        html += 
            '<tr>'+
                '<td><a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a></td>'+
                '<td>'+match.res1+'-'+match.res2+'</td>'+
                '<td><a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a></td>'+
                '<td><a href="#match-'+match.matchId+'" class="card-link">view</a></td>'+
            '</tr>';
        count += 1;
    }
    html += '</tbody></table>';
    $("#lastBattlesDiv").html(html);
}

function FillStats(played){

}

function FillRanking(played){
    CalcRankings(function(data){
        for (key in data.rounds){
            let round = data.rounds[key];
            let html = 
                '<label>'+round.name+'</label>'+
                '<table class="table table-striped">'+
                    '<thead>'+
                        '<tr>'+
                            '<th scope="col">#</th>'+
                            '<th scope="col">Player</th>'+
                            '<th scope="col">Points</th>'+
                        '</tr>'+
                    '<thead>'+
                    '<tbody>';
            let count = 1;
            for (key in round.users){
                let user = round.users[key];
                html +=
                        '<tr>'+
                            '<th scope="row">'+count+'</td>'+
                            '<td><a href="#user-'+user.name+'" class="card-link">'+user.name+'</a></td>'+
                            '<td>'+user.points+'</td>'+
                        '</tr>';
                count += 1;
            }
            html += '</tbody></table>';
            $('#rankingDiv').append(html);
        }
    });
}

function FillUpcoming(notPlayed){
    let count = 0;
    let html = 
    '<table class="table table-striped">'+
        '<thead>'+
            '<tr>'+
                '<th scope="col">Host</th>'+
                '<th scope="col"></th>'+
                '<th scope="col">Guest</th>'+
                '<th scope="col">View match</th>'+
            '</tr>'+
        '<thead>'+
        '<tbody>';
    for (match of notPlayed){
        if (count > 10){
            break;
        }
        html += 
            '<tr>'+
                '<td><a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a></td>'+
                '<td>Vs</td>'+
                '<td><a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a></td>'+
                '<td><a href="#match-'+match.matchId+'" class="card-link">view</a></td>'+
            '</tr>';
        count += 1;
    }
    html += '</tbody></table>';
    $("#upcomingBattlesDiv").html(html);
}
//# sourceURL=./js/home.js
