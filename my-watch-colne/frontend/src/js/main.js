// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll reveal animation
window.addEventListener('scroll', reveal);

function reveal() {
    const reveals = document.querySelectorAll('.watch-card');

    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const revealTop = reveals[i].getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}

// Initialize on load
reveal();

// Add to all pages
document.addEventListener('DOMContentLoaded', function() {
    const supportToggle = document.getElementById('supportToggle');
    const supportWidget = document.querySelector('.support-widget');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const startLiveChat = document.getElementById('startLiveChat');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // Toggle support widget
    supportToggle.addEventListener('click', () => {
        supportWidget.classList.toggle('active');
        chatWindow.style.display = 'none';
    });

    // Start live chat
    startLiveChat.addEventListener('click', (e) => {
        e.preventDefault();
        chatWindow.style.display = 'flex';
        supportWidget.classList.remove('active');
    });

    // Close chat window
    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // Handle sending messages
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const messageEl = document.createElement('div');
            messageEl.style.marginBottom = '10px';
            messageEl.textContent = `You: ${message}`;
            chatMessages.appendChild(messageEl);
            chatInput.value = '';
            
            // Automated response
            setTimeout(() => {
                const responseEl = document.createElement('div');
                responseEl.style.marginBottom = '10px';
                responseEl.style.color = '#0b4eec';
                responseEl.textContent = 'Support: Thank you for your message. Our team will get back to you shortly.';
                chatMessages.appendChild(responseEl);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Close support widget when clicking outside
    document.addEventListener('click', (e) => {
        if (!supportWidget.contains(e.target) && 
            !supportToggle.contains(e.target) && 
            !chatWindow.contains(e.target)) {
            supportWidget.classList.remove('active');
        }
    });
});

const trendingImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m116500ln-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126711chnr-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126613lb-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126710blro-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m124060-0001.png?impolicy=main-configurator&imwidth=800'
];

const featuredCollectionImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m126283rbr-0031.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126234-0051.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m226658-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126900-0001.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126720vtnr-0001.png?impolicy=main-configurator&imwidth=800'
];

const brandImages = [
    'https://content.rolex.com/dam/2022/upright-bba/m116519ln-0024.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m126619lb-0003.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m228236-0012.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m50535-0002.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m326238-0006.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m279138rbr-0015.png?impolicy=main-configurator&imwidth=800',
    'https://content.rolex.com/dam/2022/upright-bba/m278288rbr-0040.png?impolicy=main-configurator&imwidth=800'
];

// Function to get random elements from an array
function getRandomElements(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to handle image loading errors
function handleImageError(img) {
    console.error(`Failed to load image: ${img.src}`);
    img.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(img.alt)}`;
}

// Function to update images
function updateRandomImages() {
    // Update Trending Now section
    const trendingCards = document.querySelectorAll('.trending-now');
    const randomTrending = getRandomElements(trendingImages, trendingCards.length);
    trendingCards.forEach((img, index) => {
        img.onerror = () => handleImageError(img);
        img.src = randomTrending[index];
    });

    // Update Featured Collections section
    const featuredCards = document.querySelectorAll('.featured-collection');
    const randomFeatured = getRandomElements(featuredCollectionImages, featuredCards.length);
    featuredCards.forEach((img, index) => {
        img.onerror = () => handleImageError(img);
        img.src = randomFeatured[index];
    });

    // Update Our Brands section
    const brandCards = document.querySelectorAll('.brand-image');
    const randomBrands = getRandomElements(brandImages, brandCards.length);
    brandCards.forEach((img, index) => {
        img.onerror = () => handleImageError(img);
        img.src = randomBrands[index];
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateRandomImages);

// Optional: Update images when user clicks a refresh button
document.getElementById('refresh-images')?.addEventListener('click', updateRandomImages);

const videos = [
  './src/images/logos/first-animation.mp4',
  './src/images/logos/secound-anmation.mp4',
  './src/images/logos/therdvideo-anmation.mp4'
];
