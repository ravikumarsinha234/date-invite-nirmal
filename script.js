// EmailJS Configuration - REPLACE THESE WITH YOUR ACTUAL KEYS FROM emailjs.com
const EMAILJS_SERVICE_ID = 'ravi_rock';  // service_abc123
const EMAILJS_TEMPLATE_ID = 'template_gpwnopt'; // template_def456  
const EMAILJS_PUBLIC_KEY = 'SbtmY4QepAdCTkjgO';   // abc123def456

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const confirmBtn = document.getElementById('confirmBtn');
const backBtn = document.getElementById('backBtn');
const shareBtn = document.getElementById('shareBtn');
const confirmNoMsgBtn = document.getElementById('confirmNoMsgBtn');
const shareFinalBtn = document.getElementById('shareFinalBtn');
const question = document.getElementById('question');
const datePicker = document.getElementById('datePicker');
const messageSection = document.getElementById('messageSection');
const celebration = document.getElementById('celebration');
const dateDetails = document.getElementById('dateDetails');
const dateInput = document.getElementById('dateInput');
const customMsg = document.getElementById('customMsg');
const thankyou = document.getElementById('thankyou');

let selectedLocations = [];
let timeout;
let userDate = null;

// No button still flees (your original magic!)
function moveNoButton() {
    const rect = question.getBoundingClientRect();
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
    noBtn.style.zIndex = '1000';
    noBtn.style.transition = 'none';
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
}, { passive: false });
noBtn.addEventListener('contextmenu', (e) => e.preventDefault());

// Yes button flow
yesBtn.addEventListener('click', goToDatePicker);
yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    goToDatePicker();
});

function goToDatePicker() {
    question.classList.add('hidden');
    datePicker.classList.remove('hidden');
    dateInput.focus();
    clearTimeout(timeout);
}

confirmBtn.addEventListener('click', goToMessageSection);
backBtn.addEventListener('click', () => {
    datePicker.classList.add('hidden');
    question.classList.remove('hidden');
});

function goToMessageSection() {
    if (!dateInput.value) {
        alert('Please pick a date first! 📅');
        return;
    }
    userDate = dateInput.value;
    selectedLocations = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    datePicker.classList.add('hidden');
    messageSection.classList.remove('hidden');
    customMsg.focus();
}

shareBtn.addEventListener('click', showCelebration);
confirmNoMsgBtn.addEventListener('click', showCelebration);
shareFinalBtn.addEventListener('click', shareMoment);

function showCelebration() {
    const message = customMsg.value || 'Can\'t wait for our date!';
    
    messageSection.classList.add('hidden');
    celebration.classList.remove('hidden');
    
    // Show date details
    if (userDate) {
        const date = new Date(userDate);
        dateDetails.innerHTML = `
            <p>📅 ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            ${selectedLocations.length ? `<p>🎯 ${selectedLocations.join(', ')}</p>` : ''}
            <p>💭 "${message}"</p>
        `;
        dateDetails.classList.remove('hidden');
    }
    
    // Confetti explosion!
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
    
    thankyou.textContent = 'It\'s a DATE! 💕';
    
    // 🔥 SEND NOTIFICATION TO YOU!
    sendNotification(message);
}

// 🔥 NEW: Send notification when they complete form
async function sendNotification(message) {
    const dateStr = userDate ? new Date(userDate).toLocaleString() : 'TBD';
    const locationsStr = selectedLocations.join(', ') || 'surprise location';
    
    console.log('🚀 Sending notification...');
    console.log('Date:', dateStr);
    console.log('Locations:', locationsStr);
    console.log('Message:', message);
    
    // Always show preview toast first
    showNotificationPreview(dateStr, locationsStr, message);
    
    // Try EmailJS if configured
    if (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                date: dateStr,
                locations: locationsStr,
                message: message,
                recipient_name: 'Someone Special', // Customize this
                sender_name: 'You'
            }, EMAILJS_PUBLIC_KEY);
            
            console.log('✅ EmailJS notification sent!');
            showToast('✅ Email sent successfully!', 'success');
        } catch (error) {
            console.error('❌ EmailJS failed:', error);
            showToast('⚠️ Email setup needed - preview shown', 'warning');
        }
    } else {
        console.log('📧 EmailJS not configured - showing preview only');
        showToast('📧 Configure EmailJS keys for real emails!', 'info');
    }
}

// 🔥 Show notification preview (always works)
function showNotificationPreview(dateStr, locationsStr, message) {
    const preview = `🎉 DATE CONFIRMED! 🎉\n\n📅 ${dateStr}\n📍 ${locationsStr}\n💭 "${message}"\n\nCheck your email! 💕`;
    
    // Console notification (visible in F12)
    console.log('%c' + preview, 'background: #4caf50; color: white; padding: 10px; font-size: 14px;');
    
    // Screen toast
    showToast(preview, 'success');
}

// 🔥 Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        padding: 20px 25px; border-radius: 12px; color: white; 
        font-weight: 500; max-width: 350px; z-index: 10001;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: translateX(400px); animation: slideIn 0.4s ease-out forwards;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.4s ease-out forwards';
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}

// Share functionality
function shareMoment() {
    const dateText = userDate ? new Date(userDate).toLocaleDateString() : 'soon';
    const locationsText = selectedLocations.join(', ') || 'somewhere special';
    const messageText = customMsg.value || 'said YES to the best date ever!';
    
    const shareText = `I said YES! 🎉 Date on ${dateText} at ${locationsText}. ${messageText} 💕`;
    
    if (navigator.share) {
        navigator.share({
            title: 'I said YES to a date!',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Copied to clipboard! Share away! 📋✨', 'success');
        });
    }
}

// Auto-yes after 8 seconds
timeout = setTimeout(() => {
    if (question && !question.classList.contains('hidden')) {
        goToDatePicker();
    }
}, 8000);

// Set minimum date to tomorrow
if (dateInput) {
    dateInput.min = new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,16);
}

// 🔥 Initialize EmailJS when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('📧 EmailJS initialized');
    }
});
