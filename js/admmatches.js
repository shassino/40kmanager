function admmatchesOnLoad(){
    var request = {};
    request.session = GetSessionId();

    RequestData("./php/userlistactive.php", request, function(response){
        html = '';
        for (user of response.users){
            html += '<option>'+user+'</option>';
        }

        $('#inputHost').html(html);
        $('#inputGuest').html(html);
    });

    RequestData("./php/champdata.php", request, function(response){
        html = "";
        for (var day of response.days){
          html += '<option>'+day+'</option>';
        } 
        $("#daySelector").html(html);
    });

    FillMatches();

    $("#applyMatchButton").click(function(){
        var request = {};
        request.operation = "add";
        request.session = GetSessionId();
        request.day = $("#daySelector").val();
        request.p1 = $("#inputHost").val();
        request.p2 = $("#inputGuest").val();

        if (request.p1 === request.p2){
            AppendLog('Please select two different players');
            return;
        }

        RequestData("./php/matches.php", request, function(response){
            AppendLog('Match '+request.p1+' Vs '+request.p2+' added in day '+request.day);
            FillMatches();
        });
    });
}

function FillMatches(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "list";
    var toggle = 0;
    RequestData("./php/matches.php", request, function(response){
        var html = '<div class="table-responsive"><table class="table table-striped">'+
        '<thead>'+
            '<tr>'+
                '<th scope="col">Day</th>'+
                '<th scope="col">Host</th>'+
                '<th scope="col">Guest</th>'+
                '<th scope="col">View match</th>'+
                '<th scope="col">Delete match</th>'+
            '</tr>'+
        '<thead>'+
        '<tbody>';
        for (var match of response.matches){
            toggle = !toggle;
            html += 
            //((toggle) ? '<tr>' : '<tr style="background-color: #ebebeb;">')+
            '<tr>'+
                '<td>'+
                    '<a href="#round-'+match.day+'" class="card-link">'+match.day+'</a>'+
                '</td>'+
                '<td>'+
                    '<a href="#user-'+match.p1+'" class="card-link">'+match.p1+'</a>'+
                '</td>'+
                '<td>'+
                    '<a href="#user-'+match.p2+'" class="card-link">'+match.p2+'</a>'+
                '</td>'+
                '<td>'+
                    '<a href="#match-'+match.matchId+'" class="card-link">view</a>'+
                '</td>'+
                '<td>'+
                    '<button type="button" id="delmatch'+match.matchId+'" class="btn btn-dark">Delete</button>'+
                '</td>'+
            '</tr>';
        }
        html += '</tbody></table></div>';
        $("#champSettingsDiv").html(html);

        for (var match of response.matches){
            $('#delmatch'+match.matchId).click(function() {
                var request = {};
                request.operation = "delete";
                request.session = GetSessionId();
                request.matchId = this.id.substring(8); //remove delmatch from id
                RequestData("./php/matches.php", request, function(response){
                    AppendLog('Match correctly deleted');
                    FillMatches();
                });
            });
        }
    });
}
//# sourceURL=./js/admmatches.js