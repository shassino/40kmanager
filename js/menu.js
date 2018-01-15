function menuFunction(){
    OpenDropdown($("#menuDropdown"));
}

function historyFunction(){
    OpenDropdown($("#historyDropdown"));
}

function userFunction(){
    OpenDropdown($("#userDropdown"));
}

function adminFunction(){
    OpenDropdown($("#adminDropdown"));
}

function OpenDropdown(item){
    if (!item.hasClass('show')){
        item.addClass("show");
    }
}

function CloseAllDropdown(){
    $(".dropdown-content").each(function() {
        if ($(this).hasClass('show')) { //DOM object not jquery one
            $(this).removeClass('show');
        }
    });
}

function OnClickHome(){
    LoadHome();
}

function OnClickChampionship(){
    LoadHexMap();
}