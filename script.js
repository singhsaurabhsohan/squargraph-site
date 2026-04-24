// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Parallax Orbs
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.querySelector('.orb-1').style.transform = `translate(${x * 50}px, ${y * 50}px)`;
    document.querySelector('.orb-2').style.transform = `translate(${-x * 50}px, ${-y * 50}px)`;
});

// Chatbot Toggle
function toggleChat() {
    const body = document.getElementById('chat-body');
    body.style.display = body.style.display === 'block' ? 'none' : 'block';
}
