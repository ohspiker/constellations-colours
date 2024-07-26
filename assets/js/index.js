const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const dots = [];
const numDots = isMobile ? 30 : 70;  // Fewer dots on mobile
const dotRadius = 3;

for (let i = 0; i < numDots; i++) {
    dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,  // Slower movement
        dy: (Math.random() - 0.5) * 0.5  // Slower movement
    });
}

function updateDots() {
    dots.forEach(dot => {
        dot.x += dot.dx;
        dot.y += dot.dy;

        if (dot.x < 0 || dot.x > canvas.width) dot.dx = -dot.dx;
        if (dot.y < 0 || dot.y > canvas.height) dot.dy = -dot.dy;
    });
}

function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    });
}

function drawMouseDot() {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, dotRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

function drawTriangles() {
    const allDots = [...dots, mouse];
    const maxDistance = 150;

    for (let i = 0; i < allDots.length; i++) {
        for (let j = i + 1; j < allDots.length; j++) {
            for (let k = j + 1; k < allDots.length; k++) {
                const dot1 = allDots[i];
                const dot2 = allDots[j];
                const dot3 = allDots[k];

                const dist1 = Math.hypot(dot1.x - dot2.x, dot1.y - dot2.y);
                const dist2 = Math.hypot(dot2.x - dot3.x, dot2.y - dot3.y);
                const dist3 = Math.hypot(dot3.x - dot1.x, dot3.y - dot1.y);

                if (dist1 < maxDistance && dist2 < maxDistance && dist3 < maxDistance) {
                    const averageDist = (dist1 + dist2 + dist3) / 3;
                    const colorIntensity = 1 - (averageDist / maxDistance);

                    ctx.beginPath();
                    ctx.moveTo(dot1.x, dot1.y);
                    ctx.lineTo(dot2.x, dot2.y);
                    ctx.lineTo(dot3.x, dot3.y);
                    ctx.closePath();

                    const gradient = ctx.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${colorIntensity})`);
                    gradient.addColorStop(1, `rgba(255, 255, 255, ${colorIntensity / 2})`);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
        }
    }
}

function drawLines() {
    const allDots = [...dots, mouse];
    const maxDistance = 150;

    allDots.forEach(dot => {
        const nearestDots = [];
        allDots.forEach(otherDot => {
            if (dot !== otherDot) {
                const dotDistance = Math.hypot(otherDot.x - dot.x, otherDot.y - dot.y);
                if (dotDistance < maxDistance) {
                    nearestDots.push({ dot: otherDot, distance: dotDistance });
                }
            }
        });

        nearestDots.sort((a, b) => a.distance - b.distance);
        nearestDots.slice(0, 5).forEach(connection => {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(connection.dot.x, connection.dot.y);
            const opacity = 1 - (connection.distance / maxDistance); // Smoother fade-in effect
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
            ctx.closePath();
        });
    });
}

function animate() {
    updateDots();
    drawDots();
    drawMouseDot();
    drawTriangles();
    drawLines();
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    e.preventDefault();  // Prevent scrolling
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();
