var towerRadio = document.getElementsByName("tower_select");
var towerImg = document.getElementsByClassName("tower_img");
for (var i = 0; i < towerRadio.length; i++) {
    towerRadio[i].onchange = radioChange;
    towerRadio[i].onclick = radioClick;
}

function radioClick() {
    for (var i = 0; i < towerRadio.length; i++) {
        if (towerRadio[i] === this) {
            if (towerImg[i].classList.contains('active')) {
                towerRadio[i].checked = false;
                towerImg[i].classList.remove("active");
            }
        }
    }
}

function radioChange() {
    for (var i = 0; i < towerRadio.length; i++) {
        if (towerRadio[i] === this) {
            towerImg[i].classList.add("active");
        } else {
            towerImg[i].classList.remove("active");
        }
    }
}