function showDescription() {
    document.getElementById("landing").style.display = "none";
    document.getElementById("discover").style.display = "flex";
}

function showHome() {
    document.getElementById("discover").style.display = "none";
    document.getElementById("landing").style.display = "flex";
}

export {
    showDescription,
    showHome
}

