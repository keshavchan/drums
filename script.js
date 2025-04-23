// Audio context for Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound files mapping
const soundFiles = {
    kick: 'sounds/kick02.wav',
    snare: 'sounds/snare08.wav',
    hihat: 'sounds/hhclosed.wav',
    ride: 'sounds/congalo.wav',
    clap: 'sounds/clave.wav',
    crash: 'sounds/cymbal.wav'
};

// Cache for audio buffers
const audioBuffers = {};

// Load all audio files
async function loadAudioFiles() {
    try {
        for (const [key, url] of Object.entries(soundFiles)) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            audioBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
        }
        console.log('All audio files loaded successfully');
    } catch (error) {
        console.error('Error loading audio files:', error);
        alert('Failed to load audio files. Please check your internet connection and try again.');
    }
}

// Play sound function
function playSound(soundName) {
    if (!audioBuffers[soundName]) {
        console.error(`Sound ${soundName} not loaded`);
        return;
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[soundName];
    source.connect(audioContext.destination);
    source.start(0);
}

// Handle drum pad activation
function activateDrumPad(drumPad) {
    const container = drumPad.closest('.drum-pad-container');
    container.classList.add('active');
    const sound = drumPad.dataset.sound;
    playSound(sound);

    // Remove active class after animation
    setTimeout(() => {
        container.classList.remove('active');
    }, 100);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load audio files
    loadAudioFiles();

    // Mouse/touch events
    const drumPads = document.querySelectorAll('.drum-pad');
    drumPads.forEach(pad => {
        pad.addEventListener('click', () => activateDrumPad(pad));
        pad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            activateDrumPad(pad);
        });
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        const drumPad = document.querySelector(`[data-key="${e.key.toUpperCase()}"]`);
        if (drumPad) {
            activateDrumPad(drumPad);
        }
    });
}); 