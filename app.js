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
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Data based on typical beauty parlour services
        const mockStrapiResponse = {
            data: [
                {
                    id: 1,
                    attributes: {
                        Title: 'Bridal Makeup',
                        Description: 'Complete premium bridal package with HD makeup and hairstyling.',
                        Price: '$199',
                        Icon: 'sparkles-outline'
                    }
                },
                {
                    id: 2,
                    attributes: {
                        Title: 'Hair Styling & Spa',
                        Description: 'Revitalize your hair with our luxury organic keratin spa.',
                        Price: '$89',
                        Icon: 'cut-outline'
                    }
                },
                {
                    id: 3,
                    attributes: {
                        Title: 'Facial Treatments',
                        Description: 'Advanced glow-boosting facials and anti-aging treatments.',
                        Price: '$65',
                        Icon: 'flower-outline'
                    }
                },
                {
                    id: 4,
                    attributes: {
                        Title: 'Manicure & Pedicure',
                        Description: 'Nail perfection with relaxing hand and foot massages.',
                        Price: '$45',
                        Icon: 'color-wand-outline'
                    }
                }
            ]
        };

        renderServices(mockStrapiResponse.data);
    } catch (error) {
        console.error('Failed to load data from CMS', error);
        document.getElementById('services-cms-content').innerHTML = `
            <div style="color:red; grid-column:1/-1;">
                Error connecting to Strapi CMS. Please ensure your backend is running.
            </div>
        `;
    }
}

function renderServices(services) {
    const container = document.getElementById('services-cms-content');
    container.innerHTML = ''; // Clear loading spinner

    services.forEach(item => {
        const s = item.attributes;
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <ion-icon name="${s.Icon || 'star-outline'}" style="font-size: 3rem; color: var(--gold); margin-bottom: 1rem;"></ion-icon>
            <h3>${s.Title}</h3>
            <p>${s.Description}</p>
            <div class="service-price">${s.Price}</div>
            <button class="cta-button" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="navigateTo('contact')">Book Now</button>
        `;
        container.appendChild(card);
    });
}
