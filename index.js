const carousel  = document.getElementById('carousel');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const cardWidth = 200 + 24; // minWidth + gap
let   offset    = 0;

function getMaxOffset() {
    const visibleWidth = carousel.parentElement.offsetWidth - 44;
    const totalWidth   = carousel.scrollWidth;
    return Math.max(0, totalWidth - visibleWidth);
}

function scrollNext() {
    const max = getMaxOffset();
    if (offset >= max) {
        offset = 0;
    } else {
        offset = Math.min(offset + cardWidth, max);
    }
    carousel.style.transform = `translateX(-${offset}px)`;
}

nextBtn.addEventListener('click', () => {
    offset = Math.min(offset + cardWidth * 3, getMaxOffset());
    carousel.style.transform = `translateX(-${offset}px)`;
});

prevBtn.addEventListener('click', () => {
    offset = Math.max(0, offset - cardWidth * 3);
    carousel.style.transform = `translateX(-${offset}px)`;
});

/* ─── Animation Parcours scolaire au scroll ─────── */
const parcoursItems = document.querySelectorAll('#parcours .timeline-item');

const parcoursObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.timeline-item');
            items.forEach((item, i) => {
                setTimeout(() => item.classList.add('visible'), i * 180);
            });
            parcoursObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const parcoursSection = document.getElementById('parcours');
if (parcoursSection) parcoursObserver.observe(parcoursSection);

// Auto-scroll toutes les 2.5s, pause au survol
let autoplay = setInterval(scrollNext, 1500);

carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
carousel.parentElement.addEventListener('mouseleave', () => {
    autoplay = setInterval(scrollNext, 1500);
});
