function usrsettingsOnLoad(){

    $('#changePwdForm').submit(function(e){
        form = $('#changePwdForm :input');
        var request = {};
        form.each(function() {
            if (this.name !== ""){
                request[this.name] = this.value;
            }
        })
        request.operation = "password";
        request.session = GetSessionId();

        RequestData("./php/change.php", request, function(response){
            ShowPopUp();
        });

        e.preventDefault();
    });
}

function ShowPopUp(){
    ModalSetLabel("Password changed");
    ModalSetBody("Password correctly changed.");
    ModalSetFooter(
        '<button type="button" class="btn btn-secondary" id="modalConfirm" data-dismiss="modal">OK</button>'
    );
    ModalShow();
}