function menuFunction(){
    var wasOpen = document.getElementById("menuDropdown").classList.contains('show');
    CloseAllDropdown();

    if (!wasOpen){
        document.getElementById("menuDropdown").classList.toggle("show");
    }
}

function historyFunction(){
    var wasOpen = document.getElementById("historyDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("historyDropdown").classList.toggle("show");
    }
}

function userFunction(){
    var wasOpen = document.getElementById("userDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("userDropdown").classList.toggle("show");
    }
}

function adminFunction(){
    var wasOpen = document.getElementById("adminDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("adminDropdown").classList.toggle("show");
    }
}

function CloseAllDropdown(){
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}

function OnClickHome(){
    LoadHome();
}

function OnClickChampionship(){
    LoadHexMap();
}