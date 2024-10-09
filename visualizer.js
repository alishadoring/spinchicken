const canvas = document.getElementById('visualizer');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const startButton = document.getElementById('startButton');

// Strobe text properties
const text = "sleep";
const fontSize = 300;

startButton.addEventListener('click', async () => {
    await audioContext.resume();
    console.log('Audio context resumed.');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        console.log("Audio stream connected.");
        draw();
        startButton.style.display = 'none'; // Hide the button after starting
    } catch (err) {
        console.error('Error accessing audio input:', err);
    }
});

// Fullscreen function
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Update canvas size on fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight; // Reset to window size
    }
});

// Make canvas fullscreen on click
canvas.addEventListener('click', toggleFullscreen);

function draw() {
    requestAnimationFrame(draw);
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate the maximum volume for strobe effect
    let maxVolume = Math.max(...dataArray);
    const strobeActive = maxVolume > 75; // Lower threshold for strobe activation

    // Background strobe effect
    if (strobeActive) {
        const bgColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color for strobe effect
        ctx.fillStyle = bgColor;
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the strobe text in the center
    ctx.font = `${fontSize}px "Arial Narrow"`; // Use Arial Narrow
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text in black
    ctx.fillStyle = 'black';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2); // Center text in the canvas
}

// Ensure the audio context is resumed when the page is loaded
window.addEventListener('load', () => {
    audioContext.resume().then(() => {
        console.log('Audio context resumed');
    });
});
