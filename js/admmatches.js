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
        for (var round of response.rounds){
          html += '<option>'+round+'</option>';
        } 
        $("#roundSelector").html(html);
    });

    FillMatches();

    $("#applyMatchButton").click(function(){
        var request = {};
        request.operation = "add";
        request.session = GetSessionId();
        request.round = $("#roundSelector").val();
        request.p1 = $("#inputHost").val();
        request.p2 = $("#inputGuest").val();

        if (request.p1 === request.p2){
            AppendLog('Please select two different players');
            return;
        }

        RequestData("./php/matches.php", request, function(response){
            AppendLog('Match '+request.p1+' Vs '+request.p2+' added in round '+request.round);
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
        var html = '<table class="table">'+
        '<tr class="title">'+
            '<td style="padding: 5px;">Round</td>'+
            '<td style="padding: 5px;">Host</td>'+
            '<td style="padding: 5px;">Guest</td>'+
            '<td style="padding: 5px;">View match</td>'+
            '<td style="padding: 5px;">Delete match</td>'+
        '</tr>';
        for (var match of response.matches){
            toggle = !toggle;
            html += 
            ((toggle) ? '<tr>' : '<tr style="background-color: #ebebeb;">')+
                '<td>'+
                    '<a href="#round-'+match.round+'" class="card-link">'+match.round+'</a>'+
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
                '<td style="padding: 5px;">'+
                    '<button type="button" id="delmatch'+match.matchId+'" class="btn btn-dark">Delete</button>'+
                '</td>'+
            '</tr>';
        }
        html += '</table>'
        $("#champSettingsDiv").html(html);
    });
}
//# sourceURL=./js/admmatches.js