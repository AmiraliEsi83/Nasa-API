var wrapper = document.querySelector('svg');
function toggleAnimation() {
  wrapper.classList.toggle('active');
}

// Play draw animation once
setInterval(toggleAnimation, 1350);