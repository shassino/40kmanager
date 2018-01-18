function OnAdmUserLoad(){
    AdmUserInit();

    $('#createUserForm').submit(function(e){
        form = $('#createUserForm :input');
        var values = {};
        form.each(function() {
            if (this.name !== ""){
                values[this.name] = this.value;
            }
        })
        values.session = GetSessionId();

        $.post("./php/register.php", JSON.stringify(values), function(data, status, xhr){
            if (status == "error"){
                //handle failure
                AdmUserLog('Unable to contact server');
            }
            else {
                if (data.indexOf('OK') >= 0){
                    AdmUserLog('User: ' + values['username'] + ' correctly created');
                    AdmUserInit();
                }
                else {
                    AdmUserLog(data);
                }
            }
        });

        e.preventDefault();
    });
}

function AdmUserInit(){

}

function AdmUserLog(text){
    //TODO save on db
    $("#logDiv").append('<p>' + text + '</p>')
}