function userOnLoad(name){
    let request = {};
    request.session = GetSessionId();
    request.username = name;
    request.operation = "getprofile";
    RequestData("./php/users.php", request, function(response){
        FillProfile(response);
    });    
}

function FillProfile(response){
    let html =
        '<table class="table table-sm" style="width: 50%;">'+
            '<tbody>'+
                '<tr>'+
                    '<th scope="row">Army name: </th>'+
                    '<td>'+response.armyname+'</td>'+
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
        '</table>'+
        '<label for="listText" class="col-form-label">Army list: </label>'+
        '<div class="form-control" id="listText"></div>';
    
    $('#usrprofileDiv').html(html);
    $('#listText').html(response.list);
}
//# sourceURL=./js/user.js
