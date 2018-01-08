/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function menuFunction() {
    var wasOpen = document.getElementById("menuDropdown").classList.contains('show');
    CloseAllDropdown();

    if (!wasOpen){
        document.getElementById("menuDropdown").classList.toggle("show");
    }
}

function historyFunction() {
    var wasOpen = document.getElementById("historyDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("historyDropdown").classList.toggle("show");
    }
}

function userFunction() {
    var wasOpen = document.getElementById("userDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("userDropdown").classList.toggle("show");
    }
}

function adminFunction() {
    var wasOpen = document.getElementById("adminDropdown").classList.contains('show');
    CloseAllDropdown();
    
    if (!wasOpen){    
        document.getElementById("adminDropdown").classList.toggle("show");
    }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        CloseAllDropdown();
    }
}

function CloseAllDropdown() {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}