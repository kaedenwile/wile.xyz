import {playGame} from "./ts/battlefield";

window.onload = () => {
    document.getElementById("links").childNodes.forEach(a => {
        let content = a.innerText;
        a.id = `link_${content}`;
        a.addEventListener('click', show.bind(null, content))
    });

    playGame();
}

let currentContent = null;
function show(content, event) {
    function hideCurrentContent() {
        if (currentContent === null) return;
        document.getElementById(`link_${currentContent}`).classList.remove("active");
        document.getElementById(currentContent).style.display = 'none';
        currentContent = null;
    }

    if (content === currentContent) {
        hideCurrentContent();
    } else {
        hideCurrentContent();

        document.getElementById(`link_${content}`).classList.add("active");
        document.getElementById(content).style.display = 'block';
        currentContent = content;
    }
}