const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
    ['<span>Home</span>', '<span data-i18n="navHome">Home</span>'],
    ['<span>Menu / Rate Card</span>', '<span data-i18n="navMenu">Menu / Rate Card</span>'],
    ['<span>About</span>', '<span data-i18n="navAbout">About</span>'],
    ['<span>Contact Us</span>', '<span data-i18n="navContact">Contact Us</span>'],
    ['<span>Menu</span>', '<span data-i18n="mobileMenu">Menu</span>'],
    ['<span>Contact</span>', '<span data-i18n="mobileContact">Contact</span>'],
    ['<h1>Welcome to <span class="gold-text">ITRIK</span></h1>', '<h1><span data-i18n="heroWelcome">Welcome to</span> <span class="gold-text">ITRIK</span></h1>'],
    ['<p class="subtitle">Elegance and Beauty, Redefined.</p>', '<p class="subtitle" data-i18n="heroSubtitle">Elegance and Beauty, Redefined.</p>'],
    ['<button class="cta-button" onclick="navigateTo(\'menu\')">View Our Services</button>', '<button class="cta-button" onclick="navigateTo(\'menu\')" data-i18n="heroBtn">View Our Services</button>'],
    ['<h2>Our <span class="gold-text">Services</span> & Rate Card</h2>', '<h2><span data-i18n="menuTitle">Our</span> <span class="gold-text">Services</span><span data-i18n="menuTitle2"> & Rate Card</span></h2>'],
    ['<p>Premium treatments to make you glow.</p>', '<p data-i18n="menuSubtitle">Premium treatments to make you glow.</p>'],
    ['<button class="filter-btn active" data-filter="all">All Services</button>', '<button class="filter-btn active" data-filter="all" data-i18n="filterAll">All Services</button>'],
    ['<h2>About <span class="gold-text">ITRIK</span></h2>', '<h2><span data-i18n="aboutTitle">About</span> <span class="gold-text">ITRIK</span></h2>'],
    ['<h3>The Story of ITRIK</h3>', '<h3 data-i18n="aboutStory">The Story of ITRIK</h3>'],
    ['<p>\r\n                        Managed by the visionary <strong>Kirti Chudasama</strong>, ITRIK represents a reflection of her\r\n                        passion.\r\n                        In fact, "ITRIK" is the beautiful reverse of "KIRTI", symbolizing how true beauty reflects from\r\n                        within.\r\n                    </p>', '<p data-i18n="aboutText">\r\n                        Managed by the visionary <strong>Kirti Chudasama</strong>, ITRIK represents a reflection of her passion.\r\n                        In fact, "ITRIK" is the beautiful reverse of "KIRTI", symbolizing how true beauty reflects from within.\r\n                    </p>'],
    ['<h2><span class="gold-text">Contact</span> Us</h2>', '<h2><span class="gold-text" data-i18n="contactTitle">Contact</span><span data-i18n="contactTitle2"> Us</span></h2>'],
    ['<p>We\'d love to hear from you. Book an appointment today!</p>', '<p data-i18n="contactSubtitle">We\'d love to hear from you. Book an appointment today!</p>'],
    ['<label>Name</label>', '<label data-i18n="formName">Name</label>'],
    ['placeholder="Your Name"', 'placeholder="Your Name" data-i18n-placeholder="formNamePlaceholder"'],
    ['<label>Email</label>', '<label data-i18n="formEmail">Email</label>'],
    ['placeholder="Your Email"', 'placeholder="Your Email" data-i18n-placeholder="formEmailPlaceholder"'],
    ['<label>Message</label>', '<label data-i18n="formMessage">Message</label>'],
    ['placeholder="How can we help?"', 'placeholder="How can we help?" data-i18n-placeholder="formMessagePlaceholder"'],
    ['<button type="submit" class="cta-button">Send Message</button>', '<button type="submit" class="cta-button" data-i18n="formBtn">Send Message</button>'],
    ['<div class="loading-spinner">Loading from Strapi...</div>', '<div class="loading-spinner" data-i18n="loading">Loading from Strapi...</div>']
];

for (const [search, replace] of replacements) {
    if (!html.includes(search)) {
        console.warn('Could not find HTML line exactly matching string:\n', search);
        console.warn('Ignoring the line replacement and continuing.');
    } else {
        html = html.replace(search, replace);
    }
}

// Add the selector
html = html.replace('<div class="theme-toggle">', `<div class="lang-selector">
            <select id="language-select" aria-label="Select Language">
                <option value="en" selected>EN</option>
                <option value="hi">HI</option>
                <option value="gu">GU</option>
            </select>
        </div>
        <div class="theme-toggle">`);

fs.writeFileSync('index.html', html);
console.log('updated index.html');
