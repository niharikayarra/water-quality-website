function analyzeImage() {
    const fileInput = document.getElementById("upload");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const phText = document.getElementById("phValue");
    const statusText = document.getElementById("status");
    const tipsText = document.getElementById("tips");

    if (!fileInput.files[0]) {
        alert("Please upload an image!");
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(fileInput.files[0]);

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        let totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);

        let ph = estimatePH(r, g, b);

        phText.innerHTML = "pH Value: " + ph;

        if (ph >= 6.5 && ph <= 8.5) {
            statusText.innerHTML = "✅ Safe for Drinking";
            tipsText.innerHTML = "Drink clean water, maintain hygiene.";
        } else {
            statusText.innerHTML = "❌ Not Safe";
            tipsText.innerHTML = "Boil water, use filters, avoid contamination.";
        }
    };
}

function estimatePH(r, g, b) {
    // Approx mapping based on color dominance

    if (r > 200 && g < 100 && b < 100) return 3; // strong red (acid)
    if (r > 200 && g > 150 && b < 100) return 5; // orange/yellow
    if (g > 150 && r < 150 && b < 150) return 7; // green (neutral)
    if (b > 150 && r < 100) return 9; // blue
    if (b > 150 && r > 100) return 11; // purple

    return 7; // default neutral
}