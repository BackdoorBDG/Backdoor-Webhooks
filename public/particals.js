document.addEventListener('DOMContentLoaded', () => {
    const particlesDiv = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = `rgba(${Math.random() * 255}, 255, 255, 0.5)`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animation = `float ${3 + Math.random() * 5}s infinite`;
        particlesDiv.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
