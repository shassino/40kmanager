function rulesOnLoad() {
    var request = {};
    RequestData("./php/champdata.php", request, function(response){
        $('#rulesDiv').html(response.rules);
    });
}