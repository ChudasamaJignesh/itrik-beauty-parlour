// Main Application Script

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    loadStrapiData(); // Simulate loading content from CMS
});

/* ==============================================
   Theme Management (Dark / Light)
================================================= */
function initTheme() {
    const themeBtn = document.getElementById('theme-btn');
    // Default to dark theme for premium gold look
    let currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

/* ==============================================
   Single Page Application Navigation
================================================= */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            navigateTo(pageId);
        });
    });

    // Check hash on load
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateTo(hash);
    }
}

window.navigateTo = function (pageId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.history.pushState(null, '', `#${pageId}`);
    }

    // Update active state on nav links
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
        if (nav.getAttribute('data-page') === pageId) {
            nav.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ==============================================
   Strapi CMS Data Rendering Simulation
================================================= */
// This function simulates fetching from a Strapi backend e.g., fetch('http://localhost:1337/api/services?populate=*')
async function loadStrapiData() {
    try {
        console.log('Fetching data from Strapi backend...');

        // 1. Fetch Services
        const servicesRes = await fetch('http://localhost:1337/api/services');
        const servicesData = await servicesRes.json();
        renderServices(servicesData.data);

        // 2. Fetch About
        const aboutRes = await fetch('http://localhost:1337/api/abouts');
        const aboutData = await aboutRes.json();
        renderAbout(aboutData.data);

        // 3. Fetch Contact
        const contactRes = await fetch('http://localhost:1337/api/contacts');
        const contactData = await contactRes.json();
        renderContact(contactData.data);

    } catch (error) {
        console.error('Failed to load data from CMS', error);
        document.getElementById('services-cms-content').innerHTML = `
            <div style="color:red; grid-column:1/-1;">
                Error connecting to Strapi CMS. Ensure the Strapi server is running at http://localhost:1337
            </div>
        `;
    }
}

function renderServices(services) {
    const container = document.getElementById('services-cms-content');
    container.innerHTML = '';

    if (!services || services.length === 0) {
        container.innerHTML = '<p>No services found. Add some in Strapi!</p>';
        return;
    }

    services.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <ion-icon name="sparkles-outline" style="font-size: 3rem; color: var(--gold); margin-bottom: 1rem;"></ion-icon>
            <h3>${s.name}</h3>
            <p>${s.description || ''}</p>
            <div class="service-price">$${s.price}</div>
            <button class="cta-button" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="navigateTo('contact')">Book Now</button>
        `;
        container.appendChild(card);
    });
}

function renderAbout(aboutArr) {
    if (!aboutArr || aboutArr.length === 0) return;
    // Strapi Single types often return an array of 1 or just an object depending on version setup, handling both:
    const aboutData = Array.isArray(aboutArr) ? aboutArr[0] : aboutArr;

    const container = document.getElementById('about-cms-content');
    if (aboutData && aboutData.content) {
        // Simple extraction of richtext blocks (Strapi v5 richtext format typically uses blocks)
        let textContent = '';
        if (Array.isArray(aboutData.content)) {
            aboutData.content.forEach(p => {
                if (p.children) p.children.forEach(c => textContent += c.text + ' ');
            });
        }

        container.innerHTML = `
            <h4>${aboutData.title}</h4>
            <p>${textContent}</p>
        `;
    }
}

function renderContact(contactArr) {
    if (!contactArr || contactArr.length === 0) return;
    const contactData = Array.isArray(contactArr) ? contactArr[0] : contactArr;

    // We update the contact info directly in the DOM
    if (contactData) {
        const contactContainer = document.querySelector('.contact-info');
        if (contactContainer) {
            contactContainer.innerHTML = `
                <div class="info-item">
                    <ion-icon name="location-outline"></ion-icon>
                    <span>${contactData.address || ''}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="time-outline"></ion-icon>
                    <span>${contactData.workingHours || ''}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="call-outline"></ion-icon>
                    <span>${contactData.phone || ''}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="mail-outline"></ion-icon>
                    <span>${contactData.email || ''}</span>
                </div>
             `;
        }
    }
}
