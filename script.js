// Wedding entrance, original celebratory Web Audio score, petals and countdown.
// Audio is generated in-browser (no copyrighted recording or external audio file).
const gateScreen = document.getElementById('gateScreen');
const openGate = document.getElementById('openGate');
const site = document.getElementById('site');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
let audioContext = null, master = null, musicOn = false, musicTimer = null, beat = 0;

function note(freq, start, duration, volume, type = 'sine', destination = master) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(type === 'triangle' ? 2200 : 3200, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter); filter.connect(gain); gain.connect(destination);
  osc.start(start); osc.stop(start + duration + 0.03);
}
function drum(start, kind = 'kick') {
  const length = Math.floor(audioContext.sampleRate * (kind === 'kick' ? .16 : .11));
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = audioContext.createBufferSource(); source.buffer = buffer;
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = kind === 'kick' ? 150 : 1400;
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(kind === 'kick' ? .34 : .11, start);
  gain.gain.exponentialRampToValueAtTime(.0001, start + (kind === 'kick' ? .15 : .1));
  source.connect(filter); filter.connect(gain); gain.connect(master); source.start(start);
  if (kind === 'kick') note(82, start, .13, .12, 'sine');
}
function playBar() {
  if (!musicOn || !audioContext) return;
  const now = audioContext.currentTime + .025;
  // Bright pentatonic melody with a plucked, santoor-like timbre.
  const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 783.99, 1046.5,
                  987.77, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99];
  const i = beat % melody.length;
  note(melody[i], now, .42, .075, 'triangle');
  if (i % 2 === 0) note(melody[i] * 2, now + .015, .24, .018, 'sine');
  // Warm sustained tonic/fifth under the melody.
  const chords = [130.81, 164.81, 196.00, 164.81];
  if (i % 4 === 0) {
    note(chords[Math.floor(i / 4)] || 130.81, now, 1.05, .035, 'sine');
    note((chords[Math.floor(i / 4)] || 130.81) * 1.5, now, .9, .018, 'triangle');
  }
  // A gentle celebratory dhol-inspired pulse, not overpowering.
  if (i % 4 === 0) drum(now, 'kick');
  if (i % 4 === 2) drum(now, 'tap');
  if (i % 8 === 6) drum(now, 'kick');
  beat++;
}
function startOriginalMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!audioContext) {
    audioContext = new AudioCtx();
    master = audioContext.createGain();
    master.gain.value = 0.0001;
    master.connect(audioContext.destination);
  }
  audioContext.resume();
  musicOn = true;
  master.gain.cancelScheduledValues(audioContext.currentTime);
  master.gain.setTargetAtTime(.72, audioContext.currentTime, .35);
  if (!musicTimer) {
    playBar();
    musicTimer = window.setInterval(playBar, 300);
  }
  updateMusicButton();
}
function stopMusic() {
  if (audioContext && master) master.gain.setTargetAtTime(.0001, audioContext.currentTime, .16);
  musicOn = false;
  updateMusicButton();
}
function updateMusicButton() {
  if (!musicToggle) return;
  musicToggle.classList.toggle('off', !musicOn);
  musicLabel.textContent = musicOn ? 'MUSIC ON' : 'MUSIC OFF';
  musicToggle.setAttribute('aria-label', musicOn ? 'Turn music off' : 'Turn music on');
}
openGate.addEventListener('click', () => {
  startOriginalMusic();
  gateScreen.classList.add('opening');
  site.classList.add('visible');
  window.setTimeout(() => {
    gateScreen.classList.add('gone');
    document.body.classList.remove('locked');
    gateScreen.setAttribute('aria-hidden', 'true');
  }, 1900);
  makePetals(window.innerWidth < 600 ? 16 : 28);
});
musicToggle.addEventListener('click', () => musicOn ? stopMusic() : startOriginalMusic());

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
}), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.getElementById('progressBar').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
}, { passive: true });
function makePetals(count) {
  const layer = document.getElementById('petals');
  const symbols = ['✿', '❀', '✽', '✧'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span'); p.className = 'petal';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (10 + Math.random() * 13) + 'px';
    p.style.setProperty('--drift', (Math.random() * 140 - 70) + 'px');
    p.style.animationDuration = (7 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 2) + 's';
    layer.appendChild(p);
    window.setTimeout(() => p.remove(), 16000);
  }
}
window.setInterval(() => { if (site.classList.contains('visible')) makePetals(innerWidth < 600 ? 2 : 4); }, 6500);

// Countdown to the wedding ceremony: 12 December 2026, 7:00 PM IST.
const weddingDate = new Date('2026-12-12T19:00:00+05:30').getTime();
function tick() {
  let diff = Math.max(0, weddingDate - Date.now());
  for (const [id, size] of [['days', 86400000], ['hours', 3600000], ['minutes', 60000], ['seconds', 1000]]) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(Math.floor(diff / size)).padStart(2, '0');
    diff %= size;
  }
}
tick(); window.setInterval(tick, 1000);
