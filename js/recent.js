function recentOnLoad(){
    GetPlayedMatches(function(matches){
        let html = [];
        for (match of matches){
            if (html[match.day] == undefined){
                html[match.day] =
                    '<label>'+match.day+'</label>'+
                    '<div class="table-responsive"><table class="table table-striped">'+
                    '<thead>'+
                        '<tr>'+
                            '<th scope="col">Host</th>'+
                            '<th scope="col"></th>'+
                            '<th scope="col">Guest</th>'+
                            '<th scope="col">Round</th>'+
                            '<th scope="col">View match</th>'+
                        '</tr>'+
                    '<thead>'+
                    '<tbody>';
            }
            html[match.day] +=
                        '<tr>'+
                            '<td><a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a></td>'+
                            '<td>'+match.res1+'-'+match.res2+'</td>'+
                            '<td><a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a></td>'+
                            '<td><a href="#round-'+match.round+'" class="card-link">'+match.round+'</a></td>'+
                            '<td><a href="#match-'+match.matchId+'" class="card-link">view</a></td>'+
                        '</tr>';
        }
        for (key in html){
            roundHtml = html[key];
            roundHtml +=
                    '</tbody>'+
                '</table></div>';
            $("#recentDiv").append(roundHtml);
        }
    })
}
//# sourceURL=./js/recent.js
