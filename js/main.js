/* ========================================
   Microbiology Study Guide - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initDiseaseCards();
    initMobileMenu();
    initSmoothScroll();
});

/* Tab Navigation */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Update URL hash without scrolling
            history.replaceState(null, null, '#' + tabId);
        });
    });

    // Check for hash in URL and activate corresponding tab
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const tabBtn = document.querySelector(`[data-tab="${hash}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
}

/* Disease Tabs */
function initDiseaseCards() {
    const diseaseTabContainers = document.querySelectorAll('.disease-tabs-container');

    diseaseTabContainers.forEach(container => {
        const tabBtns = container.querySelectorAll('.disease-tab-btn');
        const panels = container.querySelectorAll('.disease-content-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const diseaseId = btn.getAttribute('data-disease');

                // Remove active class from all buttons and panels in this container
                tabBtns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button and corresponding panel
                btn.classList.add('active');
                const targetPanel = container.querySelector(`#${diseaseId}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        // Activate first tab by default
        if (tabBtns.length > 0 && panels.length > 0) {
            tabBtns[0].classList.add('active');
            panels[0].classList.add('active');
        }
    });
}

/* Mobile Menu Toggle */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarNav = document.querySelector('.navbar-nav');

    if (mobileMenuBtn && navbarNav) {
        mobileMenuBtn.addEventListener('click', () => {
            navbarNav.classList.toggle('active');

            // Toggle hamburger to X
            const icon = mobileMenuBtn.querySelector('svg');
            if (navbarNav.classList.contains('active')) {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                `;
            } else {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                `;
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarNav.classList.remove('active');
            }
        });
    }
}

/* Smooth Scrolling */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* Utility Functions */

// Print current tab content
function printContent() {
    window.print();
}

// Search functionality (if needed)
function searchDiseases(query) {
    const cards = document.querySelectorAll('.disease-card');
    const searchTerm = query.toLowerCase();

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('expanded');
        } else {
            card.style.display = 'none';
        }
    });
}

// Reset search
function resetSearch() {
    const cards = document.querySelectorAll('.disease-card');
    cards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('expanded');
    });
}

// Toggle study outline visibility
function toggleOutline(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.toggle('hidden');
    }
}

// Copy content to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
}
