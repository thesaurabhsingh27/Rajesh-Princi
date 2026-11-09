// Reveal each section gently as it enters the screen.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

// Thin progress line at the top shows how far the invitation has been read.
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Optional sound control: add your own licensed audio file as assets/ambience.mp3.
// Audio starts only after the visitor taps the sound button.
const soundToggle = document.getElementById("soundToggle");
const ambience = new Audio("assets/ambience.mp3");
ambience.loop = true;
ambience.volume = 0.25;
let soundOn = false;
soundToggle.addEventListener("click", async () => {
  try {
    if (!soundOn) {
      await ambience.play();
      soundOn = true;
      soundToggle.textContent = "SOUND ON";
    } else {
      ambience.pause();
      soundOn = false;
      soundToggle.textContent = "SOUND OFF";
    }
  } catch (error) {
    soundToggle.textContent = "ADD MUSIC FILE";
  }
});
