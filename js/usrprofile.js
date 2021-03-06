function usrprofileOnLoad(){
    let request = {};
    request.session = GetSessionId();
    request.username = username;
    request.operation = "getprofile";
    RequestData("./php/users.php", request, function(response){
        if (response.username == ""){
            //Empty profile start with Faction Selector;
            FillFactionSelector();
        }
        else {
            FillProfileSelector(response);
        }
    });    
}

function FillFactionSelector(){
    let html =
        '<div class="form-group row">'+
            '<label for="armySelector" class="col-sm-1 col-form-label">Faction: </label>'+
            '<div class="col-sm-2">'+
                '<select class="form-control" id="armySelector">';
    for (let key in FACTIONS){
        html +=     '<option>'+key+'</option>';
    }
    html +=
                '</select>'+
            '</div>'+
            '<button class="btn btn-dark col-sm-1" id="applyFaction">Apply</button>'+
        '</div>';

    $('#usrprofileDiv').html(html);

    $('#applyFaction').click(function(){
        let request = {};
        request.session = GetSessionId();
        request.faction = $('#armySelector').val();
        request.operation = "setprofile";
        RequestData("./php/users.php", request, function(response){
            usrprofileOnLoad();
        });
    });
}

function FillProfileSelector(response){
    let armyname = response.armyname;
    if (response.tokens > 0){
        let html =
            '<div class="form-group">'+
                '<div class="table-responsive"><table class="table table-sm" style="width: 50%;">'+
                    '<tbody>'+
                        '<tr>'+
                            '<th scope="row">Army name: </th>'+
                            '<td>'+
                                '<input type="text" class="form-control" id="armynameInput" value="'+armyname+'">'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<th scope="row">Faction: </th>'+
                            '<td>'+response.faction+'</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<th scope="row">Updates remaining: </th>'+
                            '<td>'+response.tokens+'</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table></div>'+
                '<label for="listText" class="col-form-label">Army list: </label>'+
                '<textarea class="form-control" id="listText"></textarea>'+
            '</div>'+
            '<button class="btn btn-dark col-sm-1" id="applyProfile">Apply</button>';
        
        $('#usrprofileDiv').html(html);
        AddEditor('#listText');
        EditorFill(response.list);

        $('#applyProfile').click(function(){
            if ($('#armynameInput').val().length == 0){
                ModalSetLabel("Error");
                ModalSetBody("Armyname cannot be empty");
                ModalSetFooter('<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>');
            }
            else if (tinymce.activeEditor.getContent().length == 0){
                ModalSetLabel("Error");
                ModalSetBody("Army list cannot be empty");
                ModalSetFooter('<button type="button" class="btn btn-warning" data-dismiss="modal">OK</button>');
            }
            else {
                ModalSetLabel("Confirm list change");
                ModalSetBody("Do you confirm the list change, once clicked OK one change token will be used for good.");
                ModalSetFooter(
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                    '<button type="button" class="btn btn-danger" id="modalConfirm" data-dismiss="modal">OK</button>'
                );
                $('#modalConfirm').click(function(){
                    let request = {};
                    request.session = GetSessionId();
                    request.armyname = $('#armynameInput').val().escapeQuotes();
                    request.list = tinymce.activeEditor.getContent();
                    request.operation = "setprofile";
                    RequestData("./php/users.php", request, function(response){
                        usrprofileOnLoad();
                    });        
                });
            }
            ModalShow();
        });
    }
    else {
        let html =
            '<div class="table-responsive"><table class="table table-sm" style="width: 50%;">'+
                '<tbody>'+
                    '<tr>'+
                        '<th scope="row">Army name: </th>'+
                        '<td>'+armyname+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th scope="row">Faction: </th>'+
                        '<td>'+response.faction+'</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<th scope="row">Updates remaining: </th>'+
                        '<td>'+response.tokens+'</td>'+
                    '</tr>'+
                '</tbody>'+
            '</table></div>'+
            '<label for="listText" class="col-form-label">Army list: </label>'+
            '<div class="form-control" id="listText"></div>';
        
        $('#usrprofileDiv').html(html);
        $('#listText').html(response.list);
    }
}
//# sourceURL=./js/usrprofile.js
