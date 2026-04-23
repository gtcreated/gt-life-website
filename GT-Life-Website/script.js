// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animate Hero Text on Load
gsap.from(".reveal-text", {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.5
});

// Create Cinematic Scroll Reveals for Gallery Cards
const cards = gsap.utils.toArray('.card-reveal');

cards.forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%", // Triggers when the top of the card hits 85% of the viewport
            toggleActions: "play none none reverse" // Plays on scroll down, reverses on scroll up
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Gentle fade-in for section titles
const titles = gsap.utils.toArray('.section-title');

titles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 90%",
        },
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: "power2.out"
    });
});
// --- SMART VIDEO PLAYLIST CAPTURE ---
// Secretly memorizes the grid order so player.html knows what's "Next"
const videoLinks = document.querySelectorAll('a.tile-link[href*="player.html"]');
if (videoLinks.length > 0) {
    videoLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            const playlist = Array.from(videoLinks).map(a => a.href);
            sessionStorage.setItem('gtPlaylist', JSON.stringify(playlist));
            sessionStorage.setItem('gtCurrentIndex', index);
        });
    });
}

// --- UPGRADED LIGHTBOX (ARROWS + SWIPE + SMART ROUTING) ---
const modal = document.getElementById("photoModal");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".close-lightbox");
const smartCommentBtn = document.getElementById("smart-comment-btn");

const photosArray = Array.from(document.querySelectorAll('.photo-item img'));
let currentPhotoIndex = 0;

if (modal && photosArray.length > 0) {
    
    // 1. Open Image
    photosArray.forEach((img, index) => {
        img.onclick = function() {
            currentPhotoIndex = index;
            updateLightboxImage();
            
            modal.style.display = "flex";
            setTimeout(() => {
                modal.style.opacity = "1";
                lightboxImg.style.transform = "scale(1)";
            }, 10);
        }
    });

    // 2. Change Image Function
    function updateLightboxImage() {
        const activeImg = photosArray[currentPhotoIndex];
        lightboxImg.src = activeImg.src;
        
        // Update Smart Comment Button
        const filename = activeImg.src.split('/').pop();
        if (smartCommentBtn) {
            smartCommentBtn.onclick = function(e) {
                e.preventDefault(); 
                closeModal(); 
                const tallyIframe = document.querySelector('.comment-widget-container iframe');
                if (tallyIframe) {
                    const baseUrl = "https://tally.so/embed/81PDaY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
                    tallyIframe.src = baseUrl + "&item=" + encodeURIComponent(filename);
                }
                document.getElementById("comments").scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // 3. Arrow Click Navigation
    document.getElementById("prevPhoto").onclick = (e) => { e.stopPropagation(); navigateLightbox(-1); };
    document.getElementById("nextPhoto").onclick = (e) => { e.stopPropagation(); navigateLightbox(1); };

    function navigateLightbox(direction) {
        currentPhotoIndex += direction;
        // Loop around if at the end/beginning
        if (currentPhotoIndex >= photosArray.length) currentPhotoIndex = 0;
        if (currentPhotoIndex < 0) currentPhotoIndex = photosArray.length - 1;
        updateLightboxImage();
    }

    // 4. Keyboard Navigation (Arrows & Esc)
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowLeft") navigateLightbox(-1);
            if (e.key === "ArrowRight") navigateLightbox(1);
            if (e.key === "Escape") closeModal();
        }
    });

    // 5. Mobile Swipe Navigation
    let touchstartX = 0;
    let touchendX = 0;
    lightboxImg.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
    lightboxImg.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 50) navigateLightbox(1); // Swipe left
        if (touchendX > touchstartX + 50) navigateLightbox(-1); // Swipe right
    });

    // 6. Close logic
    closeBtn.onclick = function() { closeModal(); }
    modal.onclick = function(event) {
        // Close if clicking the dark background (not the image or buttons)
        if (event.target !== lightboxImg && event.target.tagName !== 'A') closeModal();
    }
    function closeModal() {
        modal.style.opacity = "0";
        lightboxImg.style.transform = "scale(0.95)";
        setTimeout(() => { modal.style.display = "none"; }, 300); 
    }
}
// --- THEME TOGGLE & TOOLTIP LOGIC ---
const themeBtn = document.getElementById('theme-toggle');
const tooltip = document.getElementById('theme-tooltip');

// 1. Check browser memory to see if they already picked a theme
const currentTheme = localStorage.getItem('gtTheme');
if (currentTheme === 'night-light') {
    document.body.classList.add('night-light-theme');
    if (themeBtn) themeBtn.innerText = '☀️';
}

// 2. Button Click Event
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        // Toggle the class on the body
        document.body.classList.toggle('night-light-theme');
        
        // Save the choice and swap the icon
        if (document.body.classList.contains('night-light-theme')) {
            localStorage.setItem('gtTheme', 'night-light');
            themeBtn.innerText = '☀️';
        } else {
            localStorage.setItem('gtTheme', 'default');
            themeBtn.innerText = '🌙';
        }
        
        // Hide tooltip immediately if they use the button
        if (tooltip) {
            tooltip.classList.remove('show-tooltip');
            localStorage.setItem('gtSeenTooltip', 'true');
        }
    });
}

// 3. Tooltip Logic (Only triggers if they haven't seen it before)
if (tooltip) {
    const hasSeenTooltip = localStorage.getItem('gtSeenTooltip');
    
    if (!hasSeenTooltip) {
        // Pop up smoothly 1.5 seconds after page loads
        setTimeout(() => {
            tooltip.classList.add('show-tooltip');
        }, 1500);
        
        // Close if they click the 'X'
        const closeTooltipBtn = tooltip.querySelector('.close-tooltip');
        if (closeTooltipBtn) {
            closeTooltipBtn.addEventListener('click', () => {
                tooltip.classList.remove('show-tooltip');
                localStorage.setItem('gtSeenTooltip', 'true');
            });
        }

        // Auto-hide after 10 seconds so it doesn't stay there forever
        setTimeout(() => {
            tooltip.classList.remove('show-tooltip');
            localStorage.setItem('gtSeenTooltip', 'true');
        }, 10000);
    }
}