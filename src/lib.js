export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

let audioCtx = null;

// Se apelează la un gest al utilizatorului (Start) ca iOS să permită sunetul.
export function unlockAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {}
}

export function playChime() {
  try {
    unlockAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    [528, 792, 1056].forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime([0.22, 0.1, 0.05][i], now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5 - i * 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 3.8);
    });
  } catch {}
}

export function vibrate() {
  try {
    navigator.vibrate?.([250, 120, 250, 120, 400]);
  } catch {}
}

export function askNotificationPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  } catch {}
}

export function notify(title, body) {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const opts = { body, icon: '/icons/icon-192.png', tag: 'infuzor', renotify: true, vibrate: [200, 100, 200] };
    if (navigator.serviceWorker?.ready) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, opts))
        .catch(() => new Notification(title, opts));
    } else {
      new Notification(title, opts);
    }
  } catch {}
}

let wakeLock = null;

export async function holdScreenAwake() {
  try {
    if ('wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => (wakeLock = null));
    }
  } catch {}
}

export function releaseScreen() {
  try {
    wakeLock?.release();
  } catch {}
  wakeLock = null;
}
