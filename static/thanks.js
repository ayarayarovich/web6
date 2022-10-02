
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.addEventListener('load', () => resolve(image.src));
        image.addEventListener('error', reject);
    });
}

document.addEventListener("DOMContentLoaded", async () => {

    const e_bgCanvas = document.querySelector("#bg-canvas");

    loadImage("https://www.grandactive.ru/UploadedFiles/2021/2021-02/c809089d-ca27-41a0-8a5f-d592a60cedbe.jpg").then(function(src) {
       e_bgCanvas.style.backgroundImage = `url(${src})`;
    });
});
