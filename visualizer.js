const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const startButton = document.getElementById('startButton');
const textInput = document.getElementById('textInput');
let text = "brat"; // Default text
const fontSize = 300; // Font size for the text

// Function to start visualizer
async function startVisualizer() {
    await audioContext.resume(); // Resume audio context after user interaction
    console.log('Audio context resumed.');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        console.log("Audio stream connected.");
        draw(); // Start the drawing function
        startButton.style.display = 'none'; // Hide button after starting
        textInput.style.display = 'none'; // Hide input field after starting
    } catch (err) {
        console.error('Error accessing audio input:', err);
    }
}

// Handle Enter key press to start visualizer and hide input
textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        text = textInput.value || "brat"; // Capture user input
        startVisualizer(); // Call the function to start the visualizer
    }
});

// Start button click listener
startButton.addEventListener('click', () => {
    text = textInput.value || "brat"; // Capture user input
    startVisualizer(); // Call the function to start the visualizer
});

// Function to handle fullscreen toggle on canvas click
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

canvas.addEventListener('click', toggleFullscreen);

// Drawing function
function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    let maxVolume = Math.max(...dataArray);
    const strobeActive = maxVolume > 50; // Adjust threshold if necessary

    // Background color for strobe effect
    if (strobeActive) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the text
    ctx.font = `${fontSize}px Arial Narrow`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2); // Render the entered text
}
