function OpenDropdown(item){
    button = $(item.childNodes[1]);
    dropdown = $(item.childNodes[3]);
    button.removeClass('rounded-bottom');
    dropdown.addClass("show");
}

function CloseDropdown(item){
    button = $(item.childNodes[1]);
    dropdown = $(item.childNodes[3]);
    button.addClass('rounded-bottom');
    dropdown.removeClass("show");
}

function OnClickHome(){
    LoadHome();
}

function OnClickChampionship(){
    LoadHexMap();
}