let button = document.querySelector("button");
let whiteboardActive = false;

button.addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!whiteboardActive) {
            chrome.tabs.executeScript({
                file: 'whiteboard.js'
            });
            whiteboardActive = true;
        }
    });
});