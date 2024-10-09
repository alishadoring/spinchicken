// const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// const analyser = audioContext.createAnalyser();
// analyser.fftSize = 256;

// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyser);
//         visualize();
//     })
//     .catch(err => {
//         console.error('Error accessing audio input:', err);
//     });

// function visualize() {
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     function draw() {
//         analyser.getByteFrequencyData(dataArray);

//         // Calculate average frequency
//         let sum = 0;
//         for (let i = 0; i < bufferLength; i++) {
//             sum += dataArray[i];
//         }
//         const avgFrequency = sum / bufferLength;

//         // Update CSS variable
//         document.documentElement.style.setProperty('--freq', avgFrequency);

//         requestAnimationFrame(draw);
//     }

//     draw();
// }
