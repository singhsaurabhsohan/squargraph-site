// Cinematic Reveal on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate, .work-card, .service-item').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
    observer.observe(el);
});

// Update styles for the visible class dynamically
const style = document.createElement('style');
style.innerHTML = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Navbar Blur Transition
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Minimal Chatbot Logic
const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');

chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
});

function chatAction(type) {
    if (type === 'wa') window.open('https://wa.me/918588897488', '_blank');
    if (type === 'work') document.getElementById('work').scrollIntoView();
    if (type === 'contact') document.getElementById('contact').scrollIntoView();
    chatWindow.classList.add('hidden');
}

// Subtle Hero Parallax
window.addEventListener('mousemove', (e) => {
    const orb = document.querySelector('.orb');
    const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
    orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
});
