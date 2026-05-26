/* ─── Carrousel Technologies ──────────────────────── */
const carousel  = document.getElementById('carousel');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const cardWidth = 180 + 24; // minWidth + gap
let   offset    = 0;

function getMaxOffset() {
    const visibleWidth = carousel.parentElement.offsetWidth;
    const totalWidth   = carousel.scrollWidth;
    return Math.max(0, totalWidth - visibleWidth);
}

nextBtn.addEventListener('click', () => {
    offset = Math.min(offset + cardWidth * 2, getMaxOffset());
    carousel.style.transform = `translateX(-${offset}px)`;
});

prevBtn.addEventListener('click', () => {
    offset = Math.max(0, offset - cardWidth * 2);
    carousel.style.transform = `translateX(-${offset}px)`;
});

function scrollNext() {
    const max = getMaxOffset();
    offset = offset >= max ? 0 : Math.min(offset + cardWidth, max);
    carousel.style.transform = `translateX(-${offset}px)`;
}

let autoplay = setInterval(scrollNext, 1500);
carousel.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
carousel.parentElement.addEventListener('mouseleave', () => { autoplay = setInterval(scrollNext, 1500); });

/* ─── Sommaire dépliable ──────────────────────────── */
document.querySelectorAll('.toc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.toc-item');
        item.classList.toggle('open');
    });
});

/* ─── Lightbox Topologie ──────────────────────────── */
function openLightbox(id) {
    const lightboxId = id ? `lightbox-${id}` : 'lightbox';
    document.getElementById(lightboxId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(id) {
    const lightboxId = id ? `lightbox-${id}` : 'lightbox';
    document.getElementById(lightboxId).classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Fermer toutes les lightbox actives
        document.querySelectorAll('.lightbox.active').forEach(lb => {
            lb.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

/* ─── Sidebar TOC dynamique ───────────────────────────── */
function buildSidenav() {
    const list = document.getElementById('sidenav-list');
    if (!list) return;

    const headings = document.querySelectorAll('.chapter-title, .sub-title');
    if (!headings.length) return;

    headings.forEach((h, i) => {
        if (!h.id) h.id = 'snav-' + i;

        const li = document.createElement('li');
        const a  = document.createElement('a');

        a.href      = '#' + h.id;
        a.className = 'sidenav__link' +
                      (h.classList.contains('sub-title') ? ' sidenav__link--sub' : '');

        const raw = h.textContent.trim().replace(/\s+/g, ' ');
        a.textContent = raw.length > 34 ? raw.slice(0, 32) + '…' : raw;
        a.title = raw;

        a.addEventListener('click', e => {
            e.preventDefault();
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        li.appendChild(a);
        list.appendChild(li);
    });

    /* Scrollspy — met en évidence la section visible */
    const links = list.querySelectorAll('.sidenav__link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('is-active'));
                const active = list.querySelector(`a[href="#${entry.target.id}"]`);
                if (active) {
                    active.classList.add('is-active');
                    /* Auto-scroll du sidebar pour garder l'item actif visible */
                    active.scrollIntoView({ block: 'nearest' });
                }
            }
        });
    }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });

    headings.forEach(h => observer.observe(h));
}

document.addEventListener('DOMContentLoaded', buildSidenav);

/* ─── Animations au scroll ────────────────────────── */
document.querySelectorAll('.content-section, #technologies, #sommaire').forEach(el => {
    el.classList.add('section-reveal');
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.section-reveal').forEach(el => revealObserver.observe(el));