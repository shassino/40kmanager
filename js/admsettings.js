function admsettingsOnLoad(){
  admsettingsInit();
  
  $("#addRoundButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "add";
    request.name = $("#inputRound").text();
    RequestData("./php/champrounds.php", request, function(response){
      admsettingsInit();
    });
  });

  $("#delRoundButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "delete";
    request.rounds = new Array();

    form = $('#roundSelector option:selected');
    form.each(function() {
      values.users.push(this.value);
    });

    RequestData("./php/champrounds.php", request, function(response){
      admsettingsInit();
    });
  });

  $("#setTitleButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.name = $("#inputRound").text();
    RequestData("./php/champrounds.php", request, function(response){
      admsettingsInit();
    });
  });
}

function admsettingsInit(){
  var request = {};
  request.session = GetSessionId();
  
  RequestData("./php/champdata.php", request, function(response){
    $("#inputTitle").text(request.name);
    $("#champRulesText").text(request.rules);

    html = "";
    for (var round of request.rounds){
      html += '<option>'+round+'</option>';
    } 
    $("#roundSelector").html(html);
  });

  tinymce.remove();
  tinymce.init({
      selector: '#champRulesText',
      height: 500,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor textcolor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code help wordcount'
      ],
      toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
      content_css: [
        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        '//www.tinymce.com/css/codepen.min.css']
    });
}
//# sourceURL=./js/admsettings.js