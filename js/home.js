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
    '<table class="table">'+
        '<tr class="title">'+
            '<td style="padding: 5px;">Host</td>'+
            '<td style="padding: 5px;"></td>'+
            '<td style="padding: 5px;">Guest</td>'+
            '<td style="padding: 5px;">View match</td>'+
        '</tr>';
    for (match of played){
        if (count > 10){
            break;
        }
        html += 
            '<tr>'+
                '<td style="padding: 5px;"><a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a></td>'+
                '<td style="padding: 5px;">'+match.obj1+'-'+match.obj2+'</td>'+
                '<td style="padding: 5px;"><a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a></td>'+
                '<td style="padding: 5px;"><a href="#match-'+match.matchId+'" class="card-link">view</a></td>'+
            '</tr>';
        count += 1;
    }
    html += '</table>'
    $("#lastBattlesDiv").html(html);
}

function FillStats(played){

}

function FillRanking(played){

}

function FillUpcoming(notPlayed){
    let count = 0;
    let html = 
    '<table class="table">'+
        '<tr class="title">'+
            '<td style="padding: 5px;">Host</td>'+
            '<td style="padding: 5px;"></td>'+
            '<td style="padding: 5px;">Guest</td>'+
            '<td style="padding: 5px;">View match</td>'+
        '</tr>';
    for (match of notPlayed){
        if (count > 10){
            break;
        }
        html += 
            '<tr>'+
                '<td style="padding: 5px;"><a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a></td>'+
                '<td style="padding: 5px;">Vs</td>'+
                '<td style="padding: 5px;"><a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a></td>'+
                '<td style="padding: 5px;"><a href="#match-'+match.matchId+'" class="card-link">view</a></td>'+
            '</tr>';
        count += 1;
    }
    html += '</table>'
    $("#upcomingBattlesDiv").html(html);
}
//# sourceURL=./js/home.js
