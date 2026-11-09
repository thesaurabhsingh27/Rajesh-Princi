// Gate opens only after a deliberate tap, which also permits the original instrumental sound to start.
const gateScreen=document.getElementById('gateScreen');
const openGate=document.getElementById('openGate');
const site=document.getElementById('site');
const musicToggle=document.getElementById('musicToggle');
const musicLabel=document.getElementById('musicLabel');
let audioContext=null, musicTimer=null, musicOn=false, master=null;

function startOriginalMusic(){
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;
  if(!audioContext){
    audioContext=new AudioCtx(); master=audioContext.createGain(); master.gain.value=0.0001; master.connect(audioContext.destination);
    const notes=[261.63,329.63,392.00,440.00,392.00,329.63,293.66,349.23,440.00,523.25,440.00,392.00];
    let step=0;
    const playNote=()=>{
      if(!musicOn||!audioContext)return;
      const now=audioContext.currentTime, freq=notes[step%notes.length];
      const osc=audioContext.createOscillator(), gain=audioContext.createGain(), filter=audioContext.createBiquadFilter();
      osc.type='sine';osc.frequency.setValueAtTime(freq,now);filter.type='lowpass';filter.frequency.value=1400;
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.11,now+.08);gain.gain.exponentialRampToValueAtTime(.0001,now+2.1);
      osc.connect(filter);filter.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+2.2);
      // A soft fifth underneath gives the melody a warm, floating character.
      if(step%3===0){const pad=audioContext.createOscillator(),pg=audioContext.createGain();pad.type='triangle';pad.frequency.value=freq/2;pg.gain.setValueAtTime(.0001,now);pg.gain.exponentialRampToValueAtTime(.025,now+.35);pg.gain.exponentialRampToValueAtTime(.0001,now+2.8);pad.connect(pg);pg.connect(master);pad.start(now);pad.stop(now+2.9)}
      step++;
    };
    playNote();musicTimer=setInterval(playNote,850);
  }
  audioContext.resume();master.gain.cancelScheduledValues(audioContext.currentTime);master.gain.setTargetAtTime(.55,audioContext.currentTime,.8);musicOn=true;
}
function stopMusic(){if(!audioContext||!master)return;master.gain.setTargetAtTime(.0001,audioContext.currentTime,.25);musicOn=false;}
function updateMusicButton(){musicToggle.classList.toggle('off',!musicOn);musicLabel.textContent=musicOn?'MUSIC ON':'MUSIC OFF';musicToggle.setAttribute('aria-label',musicOn?'Turn music off':'Turn music on')}
openGate.addEventListener('click',()=>{
  startOriginalMusic();gateScreen.classList.add('opening');site.classList.add('visible');
  window.setTimeout(()=>{gateScreen.classList.add('gone');document.body.classList.remove('locked');gateScreen.setAttribute('aria-hidden','true');},1900);
  updateMusicButton();makePetals(24);
});
musicToggle.addEventListener('click',()=>{if(musicOn)stopMusic();else startOriginalMusic();updateMusicButton()});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('progressBar').style.width=(max>0?scrollY/max*100:0)+'%'});
function makePetals(count){const layer=document.getElementById('petals');const symbols=['✿','❀','✽','·'];for(let i=0;i<count;i++){const p=document.createElement('span');p.className='petal';p.textContent=symbols[Math.floor(Math.random()*symbols.length)];p.style.left=Math.random()*100+'%';p.style.fontSize=(10+Math.random()*13)+'px';p.style.setProperty('--drift',(Math.random()*180-90)+'px');p.style.animationDuration=(7+Math.random()*8)+'s';p.style.animationDelay=(Math.random()*5)+'s';layer.appendChild(p);setTimeout(()=>p.remove(),16000)}}
setInterval(()=>{if(site.classList.contains('visible'))makePetals(3)},6500);
// Wedding date: 12 December 2026, 7:00 PM IST.
const weddingDate=new Date('2026-12-12T19:00:00+05:30').getTime();
function tick(){let diff=Math.max(0,weddingDate-Date.now());const units=[['days',86400000],['hours',3600000],['minutes',60000],['seconds',1000]];for(const [id,size] of units){const el=document.getElementById(id);if(el)el.textContent=String(Math.floor(diff/size)).padStart(2,'0');diff%=size}}
tick();setInterval(tick,1000);
