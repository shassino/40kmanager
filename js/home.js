function homeOnLoad(){
    let request = {};
    request.operation = "list";

    let notPlayed = [];
    let played = [];

    RequestData("./php/matches.php", request, function(response){
        for (match of response.matches){
            if (match.played === "0000-00-00 00:00:00"){
                notPlayed.push(match);
            }
            else {
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

        FillPlayed(played);
        FillStats(played);
        FillRanking(played);
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
