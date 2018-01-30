var championship;
var editorInited;
function admsettingsOnLoad(){
  editorInited = false;
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

  tinymce.activeEditor.on('init',function(){
    editorInited = true;
  });

  admsettingsInit();
  
  $("#addRoundButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "add";
    request.name = $("#inputRound").val();
    request.championship = championship;
    RequestData("./php/champrounds.php", request, function(response){
      AppendLog('Round '+ request.name + ' correctly added to championship '+request.championship);
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
      request.rounds.push(this.value);
    });

    RequestData("./php/champrounds.php", request, function(response){
      AppendLog('Round '+ request.name + ' correctly removed from championship '+request.championship);
      admsettingsInit();
    });
  });

  $("#setTitleButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    input = $("#inputChamp");
    request.name = input.val();
    RequestData("./php/champadd.php", request, function(response){
      AppendLog('Championship '+request.championship+' added and set as active');
      admsettingsInit();
    });
  });

  $('#applyRulesButton').click(function(){
    var request = {};
    request.session = GetSessionId();
    request.rules = tinymce.activeEditor.getContent();
    RequestData("./php/champrules.php", request, function(response){
      AppendLog('Championship rules updated');
      admsettingsInit();
    });
  });
}

function admsettingsInit(){
  var request = {};
  request.session = GetSessionId();
  
  RequestData("./php/champdata.php", request, function(response){
    $("#currentChamp").val(response.name);
    championship = response.name;

    html = "";
    for (var round of response.rounds){
      html += '<option>'+round+'</option>';
    } 
    $("#roundSelector").html(html);

    EditorFill(response.rules);
  });
}

function EditorFill(rules){
  if (editorInited){
    tinymce.activeEditor.setContent(rules);
  }
  else {
    setTimeout(function() { EditorFill(rules); }, 100);
  }
}
//# sourceURL=./js/admsettings.js