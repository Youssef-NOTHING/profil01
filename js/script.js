// Simple animation on scroll (optional)
window.addEventListener('scroll', () => {
  document.querySelectorAll('section').forEach(section => {
    const position = section.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      section.style.opacity = 1;
      section.style.transform = 'translateY(0)';
    }
  });
});

// Global filter function used by inline onclick handlers
window.filterProjects = function (category) {
  const cat = (category || 'all').toLowerCase();
  const projectsSection = document.getElementById('projects');

  // If projects aren't on this page, redirect to business page with category preserved
  if (!projectsSection) {
    const q = cat && cat !== 'all' ? `?category=${encodeURIComponent(cat)}` : '';
    window.location.href = `business.html${q}#projects`;
    return;
  }

  const cards = document.querySelectorAll('.project-card');

  // Toggle active state on buttons
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[onclick*="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Filter cards
  cards.forEach(card => {
    const data = (card.getAttribute('data-category') || '').toLowerCase();
    const show = cat === 'all' || data.includes(cat);
    card.style.display = show ? '' : 'none';
  });

  // Optional: scroll to projects section
  const projects = document.getElementById('projects');
  if (projects) projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Fullscreen toggle for project media containers
window.toggleFullscreen = function (button) {
  const media = button && button.closest('.project-media');
  if (!media) return;

  if (!document.fullscreenElement && media.requestFullscreen) {
    media.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};

// Enable click-to-play/pause on videos and keep overlay unobtrusive
window.addEventListener('DOMContentLoaded', () => {
  // If a category is provided via URL, apply the filter on load (business page)
  try {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      window.filterProjects(categoryParam);
    }
  } catch {}

  // Mobile nav toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  document.querySelectorAll('.project-media').forEach(media => {
    const video = media.querySelector('video');
    const overlay = media.querySelector('.play-overlay');
    const playIcon = media.querySelector('.play-icon');

    if (video) {
      // Click on media toggles play/pause (except fullscreen button)
      media.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('fullscreen-btn')) return;
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      // Play icon explicitly toggles play/pause
      if (playIcon) {
        playIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        });
      }

      // Hide overlay while playing; restore default when paused
      if (overlay) {
        video.addEventListener('play', () => {
          overlay.style.opacity = 0;
        });
        video.addEventListener('pause', () => {
          overlay.style.opacity = '';
        });
      }
    }
  });
});