var rounds;
function admmatchesOnLoad(){
    var request = {};
    request.operation = "getcurrent";
    request.session = GetSessionId();
    RequestData("./php/championship.php", request, function(response){
        request.operation = "list";
        request.championship = response.name;
        RequestData("./php/rounds.php", request, function(response){
            rounds = response.rounds;
            FillMatchCreatorDiv();
        });
    });

    FillMatches();
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
                '<th scope="col">Round</th>'+
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
                    '<a href="#day-'+match.day+'" class="card-link">'+match.day+'</a>'+
                '</td>'+
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

function FillMatchCreatorDiv(){
    $('#matchCreatorDiv').html("");
    var request = {};
    request.session = GetSessionId();

    RequestData("./php/champdata.php", request, function(response){
        let htmlDay = "";
        for (var day of response.days){
            htmlDay += '<option>'+day+'</option>';
        }
        
        var request = {};
        request.session = GetSessionId();
        request.operation = "listusers";

        for (let round of rounds){
            request.round = round;
            RequestData("./php/rounds.php", request, function(response){
                let htmlUser = "";
                for (let user of response.users){
                    htmlUser += '<option>'+user+'</option>';
                }

                let round = response.rounds[0];
                let html = 
                '<div class="form-group">'+
                    '<label class="col-sm-1 col-form-label" style="text-align: center;">'+round+'</label>'+
                    '<div class="form-group row">'+
                        '<div class="col-sm-2">'+
                            '<select class="form-control" id="'+round+'daySelector" style="width: 100%;">'+
                                htmlDay+
                            '</select>'+
                        '</div>'+
                        '<label for="inputHost" class="col-sm-2 col-form-label" style="text-align: center;">Host</label>'+
                        '<div class="col-sm-2">'+
                            '<select class="form-control" id="'+round+'inputHost">'+
                                htmlUser+
                            '</select>'+
                        '</div>'+
                        '<label class="col-sm-1 col-form-label" style="text-align: center;">Vs</label>'+
                        '<div class="col-sm-2">'+
                            '<select class="form-control" id="'+round+'inputGuest">'+
                                htmlUser+
                            '</select>'+
                        '</div>'+
                        '<label for="inputGuest" class="col-sm-2 col-form-label" style="text-align: center;">Guest</label>'+
                        '<button type="button" id="'+round+'applyMatchButton" class="btn btn-dark">Add</button>'
                    '</div></div>';
                $('#matchCreatorDiv').append(html);

                $('#'+round+'applyMatchButton').click({round: round}, function(event){
                    let round = event.data.round;

                    var request = {};
                    request.operation = "add";
                    request.session = GetSessionId();
                    request.day = $('#'+round+'daySelector').val();
                    request.p1 = $('#'+round+'inputHost').val();
                    request.p2 = $('#'+round+'inputGuest').val();
                    request.round = round;
            
                    if (request.p1 === request.p2){
                        AppendLog('Please select two different players');
                        return;
                    }
            
                    RequestData("./php/matches.php", request, function(response){
                        AppendLog('Match '+request.p1+' Vs '+request.p2+' added in day '+request.day);
                        FillMatches();
                    });
                })
            });
        }
    });
}
//# sourceURL=./js/admmatches.js

