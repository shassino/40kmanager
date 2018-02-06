var championship;
function admsettingsOnLoad(){
  AddEditor('#champRulesText');

  admsettingsInit();
  
  $("#addDayButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "add";
    request.name = $("#inputDay").val();
    request.championship = championship;
    RequestData("./php/days.php", request, function(response){
      AppendLog('Day '+ request.name + ' correctly added to championship '+request.championship);
      admsettingsInit();
    });
  });

  $("#delDayButton").click(function(){
    var request = {};
    request.session = GetSessionId();
    request.operation = "delete";
    request.days = new Array();

    form = $('#daySelector option:selected');
    form.each(function() {
      request.days.push(this.value);
    });

    RequestData("./php/days.php", request, function(response){
      AppendLog('Days '+ request.name + ' correctly removed from championship '+request.championship);
      admsettingsInit();
    });
  });

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

    html = "";
    for (var day of response.days){
      html += '<option>'+day+'</option>';
    } 
    $("#daySelector").html(html);

    EditorFill(response.rules);
  });
}
//# sourceURL=./js/admsettings.js