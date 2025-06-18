document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', function () {
        // Toggle the 'active' class to show/hide the navigation links
        navLinks.classList.toggle('active');
        // Also toggle 'active' class on hamburger menu for the CSS animation (e.g., turning into an 'X')
        hamburgerMenu.classList.toggle('active');
        // Update aria-expanded attribute for accessibility
        hamburgerMenu.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    // Close the mobile menu when a navigation link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerMenu.classList.remove('active'); // Remove active class from hamburger too
            hamburgerMenu.setAttribute('aria-expanded', 'false');
        });
    });

    // Get elements for the custom message box and loading spinner
    const messageBoxOverlay = document.getElementById('message-box-overlay');
    const messageBoxText = document.getElementById('message-box-text');
    const messageBoxOkBtn = document.getElementById('message-box-ok');
    const loadingSpinner = document.getElementById('loading-spinner');
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');

    /**
     * Displays a custom message box.
     * @param {string} message The text message to display.
     * @param {boolean} isError If true, applies error styling to the message.
     */
    function showMessageBox(message, isError = false) {
        messageBoxText.textContent = message;
        if (isError) {
            messageBoxText.classList.add('error');
        } else {
            messageBoxText.classList.remove('error');
        }
        messageBoxOverlay.classList.remove('hidden');
        messageBoxOverlay.setAttribute('aria-hidden', 'false');
        messageBoxOkBtn.focus(); // Focus on OK button for accessibility
    }

    /**
     * Hides the custom message box.
     */
    function closeMessageBox() {
        messageBoxOverlay.classList.add('hidden');
        messageBoxOverlay.setAttribute('aria-hidden', 'true');
    }

    // Event listener for the OK button in the message box
    messageBoxOkBtn.addEventListener('click', closeMessageBox);

    // Close message box if clicking outside the content
    messageBoxOverlay.addEventListener('click', (e) => {
        if (e.target === messageBoxOverlay) {
            closeMessageBox();
        }
    });

    // Formspree submission handling using Fetch API
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent default browser form submission (page reload)

        // Show loading spinner and disable submit button
        loadingSpinner.classList.remove('hidden');
        submitButton.disabled = true;

        const formData = new FormData(this); // Get form data

        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for Formspree AJAX
                }
            });

            if (response.ok) {
                showMessageBox("Message sent successfully!");
                contactForm.reset(); // Clear form fields on success
            } else {
                const data = await response.json();
                if (data.errors) {
                    showMessageBox(data.errors.map(error => error.message).join(", "), true);
                } else {
                    showMessageBox("Failed to send message. Please try again.", true);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessageBox("An unexpected error occurred. Please try again later.", true);
        } finally {
            // Hide loading spinner and re-enable submit button
            loadingSpinner.classList.add('hidden');
            submitButton.disabled = false;
        }
    });
});

// Lightbox functionality for portfolio images/videos (original logic, independent of form)
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxContent = document.getElementById('lightbox-content');
const closeBtn = document.getElementById('lightbox-close');
let lastFocusedElement = null; // To store the last focused element for accessibility

function openLightbox(type, src) {
    lastFocusedElement = document.activeElement; // Save the element that triggered the lightbox
    // Clear any previous content in the lightbox
    lightboxContent.querySelectorAll('img, video').forEach(e => e.remove());

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Expanded portfolio image';
        lightboxContent.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.style.maxHeight = '90vh'; // Ensure video fits within viewport
        lightboxContent.appendChild(video);
    }
    // Activate the lightbox overlay
    lightboxOverlay.classList.add('active');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus(); // Focus on OK button for accessibility
}

function closeLightbox() {
    // Deactivate the lightbox overlay
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    // Return focus to the element that opened the lightbox
    if(lastFocusedElement) lastFocusedElement.focus();
}

// Event listeners for closing the lightbox
closeBtn.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', (e) => {
    // Close if clicking outside the content but within the overlay
    if(e.target === lightboxOverlay) {
        closeLightbox();
    }
});
// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && lightboxOverlay.classList.contains('active')){
        closeLightbox();
    }
});

// Attach event listeners to portfolio items (these elements are expected to be on separate portfolio pages)
// Note: These elements (.portfolio-item) are not present in THIS HTML snippet,
// but this JS is kept for continuity with your original code structure.
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        openLightbox(item.dataset.type, item.dataset.src);
    });
    item.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Prevent default space/enter behavior
            openLightbox(item.dataset.type, item.dataset.src);
        }
    });
});