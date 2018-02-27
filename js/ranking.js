function rankingOnLoad(){
    let request = {};
    request.operation = "list";

    FillRanking();
}

function FillRanking(played){
    CalcRankings(function(data){
        for (key in data.rounds){
            let round = data.rounds[key];
            let html = 
                '<label>'+round.name+'</label>'+
                '<div class="table-responsive"><table class="table table-striped">'+
                    '<thead>'+
                        '<tr>'+
                            '<th scope="col">#</th>'+
                            '<th scope="col">Player</th>'+
                            '<th scope="col">Points</th>'+
                            '<th scope="col">Played</th>'+
                            '<th scope="col">Won</th>'+
                            '<th scope="col">Tie</th>'+
                            '<th scope="col">Lost</th>'+
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
                            '<td>'+user.played+'</td>'+
                            '<td>'+user.won+'</td>'+
                            '<td>'+user.tie+'</td>'+
                            '<td>'+user.lost+'</td>'+
                        '</tr>';
                count += 1;
            }
            html += '</tbody></table></div>';
            $('#rankingDiv').append(html);
        }
    });
}

//# sourceURL=./js/ranking.js
