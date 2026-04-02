const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPause");
const progressBar = document.getElementById("progressBar");
const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");
const coverImage = document.getElementById("coverImage");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let playlist = [];
let currentIndex = -1;

const coverImages = [
  "default-cover.png",
  "default-cover1.png",
  "default-cover2.png"
];

function handleFiles(files) {
  for (const file of files) {
    if (!file || !file.type.startsWith("audio/")) continue;

    const url = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    const song = {
      name: fileName,
      url: url,
      cover: "default-cover.png",
    };

    playlist.push(song);
  }

  if (currentIndex === -1 && playlist.length > 0) {
    currentIndex = 0;
    loadSong(currentIndex);
  }
}

function getSequentialCover(index) {
  const coverIndex = index % coverImages.length;
  return coverImages[coverIndex];
}

function loadSong(index) {
  const song = playlist[index];
  if (!song) return;

  audio.src = song.url;
  document.querySelector(".song-title").textContent = song.name;

  const cover = getSequentialCover(index);
  coverImage.src = `${cover}?t=${Date.now()}`;
  coverImage.style.display = "block";

  coverImage.onerror = () => {
    coverImage.src = "default-cover.png";
  };

  isPlaying = false;
  playPauseIcon.src = "btn-play.png";
}

nextBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  console.log("Next button clicked, new index:", currentIndex);
  loadSong(currentIndex);
});

prevBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
});

let isPlaying = false;
console.log('electronAPI:', window.electronAPI);
console.log('window.electronAPI:', window.electronAPI);

fileInput.addEventListener("change", function () {
  handleFiles(this.files);
});

dropArea.addEventListener("click", (e) => {
  if (e.target.closest("button")) return;

  fileInput.click();
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    handleFiles(e.dataTransfer.files);
  }
});

const playPauseIcon = document.getElementById("playPauseIcon");

playPauseBtn.addEventListener("click", () => {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
    playPauseIcon.src = "btn-play.png";
  } else {
    audio.play();
    playPauseIcon.src = "btn-pause.png";
  }
  isPlaying = !isPlaying;
});

audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
});

function attachWindowControlListeners() {
  const minBtn = document.querySelector('.min-btn');
  const closeBtn = document.querySelector('.close-btn');

  console.log("Attaching window controls", { minBtn, closeBtn, electronAPI: window.electronAPI });

  if (minBtn && window.electronAPI) {
    minBtn.addEventListener('click', () => {
      window.electronAPI.minimizeWindow();
    });
  }

  if (closeBtn && window.electronAPI) {
    closeBtn.addEventListener('click', () => {
      window.electronAPI.closeWindow();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  attachWindowControlListeners();
});
