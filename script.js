const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const buttons = document.querySelector('.buttons');
const thankyou = document.getElementById('thankyou');

let timeout;

// No button flees from mouse/touch
function moveNoButton() {
    const rect = buttons.getBoundingClientRect();
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
    noBtn.style.zIndex = '1000';
    noBtn.style.transition = 'none'; // Instant jump
}

// Desktop hover + mobile touch
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent actual touch action
    moveNoButton();
}, { passive: false });

// Prevent context menu on long press (mobile)
noBtn.addEventListener('contextmenu', (e) => e.preventDefault());

// Yes triggers thank you
yesBtn.addEventListener('click', showThankYou);
yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showThankYou();
});

function showThankYou() {
    buttons.style.display = 'none';
    thankyou.classList.remove('hidden');
    clearTimeout(timeout);
}

// Auto-show after 5s
timeout = setTimeout(showThankYou, 5000);
