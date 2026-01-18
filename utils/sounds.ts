// Sound management utility
import { Howl } from 'howler';

class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private enabled: boolean = true;
    private volume: number = 0.5;

    constructor() {
        // Load saved settings
        const savedEnabled = localStorage.getItem('soundEnabled');
        const savedVolume = localStorage.getItem('soundVolume');

        this.enabled = savedEnabled !== null ? savedEnabled === 'true' : true;
        this.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
    }

    // Initialize sounds using data URIs (small sound effects)
    initializeSounds() {
        // Simple beep sounds using Web Audio API instead of files
        this.sounds.set('achievement', this.createBeep(800, 0.2));
        this.sounds.set('completion', this.createBeep(600, 0.15));
        this.sounds.set('levelup', this.createBeep(1000, 0.3));
        this.sounds.set('click', this.createBeep(400, 0.05));
        this.sounds.set('error', this.createBeep(200, 0.1));
    }

    // Create a simple beep sound
    private createBeep(frequency: number, duration: number): Howl {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create audio data for Howler
        const bufferLength = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferLength, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferLength; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / audioContext.sampleRate) *
                Math.exp(-3 * i / bufferLength); // Fade out
        }

        return new Howl({
            src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='],
            volume: this.volume,
        });
    }

    play(soundName: string) {
        if (!this.enabled) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.volume(this.volume);
            sound.play();
        }
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        localStorage.setItem('soundEnabled', enabled.toString());
    }

    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('soundVolume', this.volume.toString());

        // Update all sounds
        this.sounds.forEach(sound => sound.volume(this.volume));
    }

    getEnabled(): boolean {
        return this.enabled;
    }

    getVolume(): number {
        return this.volume;
    }
}

// Haptic feedback
export const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!navigator.vibrate) return;

    const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
    };

    navigator.vibrate(patterns[pattern]);
};

// Export singleton
export const soundManager = new SoundManager();
soundManager.initializeSounds();
