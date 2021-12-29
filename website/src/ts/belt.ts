window.onload = () => {
    document.getElementById("learn-more-button").addEventListener('click', () => {
        document.getElementById("landing").style.display = "none";
        document.getElementById("discover").style.display = "flex";
    })
    document.getElementById("show-home-button").addEventListener('click', () => {
        document.getElementById("discover").style.display = "none";
        document.getElementById("landing").style.display = "flex";
    })
}