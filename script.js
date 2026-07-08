
// --- 1. Global Mouse State Tracker ---
let globalMouse = { x: null, y: null, radius: 150 };

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initCustomCursor();
  initMagneticElements();
  initScrollNavEffects();
  initTypingEffect();
  initRevealAnimations();
  initSpotlightAndTilt();
  initProjectFiltering();
  initSkills3DSphere();
  initParticlesBackground();
  initEmailJS();
  initResumeModal();
  initHeroVideoAutoplay(); // Autoplay handler for background video
});

// --- 2. Theme Switching Logic (Dark / Light) ---
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(themeToggle, savedTheme);
  
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    updateThemeIcon(themeToggle, newTheme);
  });
}

// --- 3. Mobile Navigation Menu Toggle ---
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("open-menu");
    navMenu.classList.toggle("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("open-menu");
      navMenu.classList.remove("open");
    });
  });
}

function updateThemeIcon(button, theme) {
  const icon = button.querySelector("i");
  if (theme === "dark") {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
}

// --- 4. Custom Glowing Double Cursor ---
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const cursorFollower = document.getElementById("custom-cursor-follower");
  const hoverTargets = document.querySelectorAll(".hover-target");
  
  if (!cursor || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core dot moves instantly
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower has smooth delay (lerp)
  function animateFollower() {
    let ease = 0.16; // delay coefficient
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover target states
  hoverTargets.forEach(target => {
    target.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");
      cursorFollower.classList.add("hovering");
    });
    target.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
      cursorFollower.classList.remove("hovering");
    });
  });
}

// --- 5. Magnetic Hover Translation Effect (Buttons & Logo) ---
function initMagneticElements() {
  const magneticItems = document.querySelectorAll(".hover-target");
  
  // Skip on touchscreens
  if (window.matchMedia("(pointer: coarse)").matches) return;

  magneticItems.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      
      // Pull element slightly towards cursor (spring action)
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0px, 0px)";
      btn.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
      setTimeout(() => {
        btn.style.transition = "";
      }, 500);
    });
  });
}

// --- 6. Navbar Scroll Hiding & Resizing ---
function initScrollNavEffects() {
  const header = document.querySelector(".header");
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculations
    if (documentHeight > 0) {
      scrollProgress.style.width = `${(scrollY / documentHeight) * 100}%`;
    }

    // Nav Resize
    if (scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }

    // Hide on Scroll Down, Show on Scroll Up
    if (scrollY > lastScrollY && scrollY > 120) {
      header.classList.add("hidden");
    } else {
      header.classList.remove("hidden");
    }

    // Scroll-to-top show/hide
    if (scrollY > 400) {
      backToTopBtn.classList.add("show-btn");
    } else {
      backToTopBtn.classList.remove("show-btn");
    }

    // Highlight links
    let currentSectionId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove("active-link");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active-link");
        }
      });
    }

    lastScrollY = scrollY;
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// --- 7. Typing Subtitle Loop Effect ---
function initTypingEffect() {
  const typingTarget = document.getElementById("typing-text");
  if (!typingTarget) return;

  const words = [
    "Full-Stack Applications.",
    "Scalable Web Apps.",
    "Modern Web Solutions.",
    "Computer Science Student."
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800; // pause at complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

// --- 8. Hacker Text Decrypt/Decode Animation ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
function decodeText(element) {
  let iteration = 0;
  const originalText = element.dataset.value || element.innerText;
  if (!element.dataset.value) element.dataset.value = originalText;
  
  clearInterval(element.decodeInterval);
  
  element.decodeInterval = setInterval(() => {
    element.innerText = originalText
      .split("")
      .map((letter, index) => {
        if(index < iteration) {
          return originalText[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");
    
    if(iteration >= originalText.length){ 
      clearInterval(element.decodeInterval);
    }
    
    iteration += 1 / 3;
  }, 25);
}

// --- 9. Reveal Animations & Scramble Trigger ---
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  let revealDelay = 0;
  let resetTimeout = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
          
          // Scramble text if gradient title enters viewport
          const gradientTitle = entry.target.querySelector('.gradient-text') || (entry.target.classList.contains('gradient-text') ? entry.target : null);
          if (gradientTitle) {
            decodeText(gradientTitle);
          }
        }, revealDelay);

        revealDelay += 150; // stagger reveal
        observer.unobserve(entry.target);
      }
    });

    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      revealDelay = 0;
    }, 100);
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// --- 10. Card Spotlights & 3D Tilt Transforms ---
function initSpotlightAndTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      // Set CSS variables for spotlight radial-gradient
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      
      // Calculate 3D tilt angles
      if (el.classList.contains('project-card') || el.classList.contains('about-card') || el.classList.contains('profile-image-container')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (el.classList.contains('project-card') || el.classList.contains('about-card') || el.classList.contains('profile-image-container')) {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    });
  });
}

// --- 11. Projects Category Filtering controls ---
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          card.style.animation = "skillFadeIn 0.4s ease forwards";
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// --- 12. Skills 3D Tag Cloud Sphere ---
function initSkills3DSphere() {
  const myTags = [
    'Java', 'Python', 'C', 'SQL', 'MySQL', 'MongoDB', 
    'React.js', 'Node.js', 'Express.js', 'Django', 
    'HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub', 
    'DSA', 'DBMS', 'Operating Systems', 'Computer Networks'
  ];

  if (typeof TagCloud !== 'undefined' && document.getElementById('skills-3d-sphere')) {
    TagCloud('#skills-3d-sphere', myTags, {
      radius: window.innerWidth < 480 ? 140 : (window.innerWidth < 768 ? 170 : 200),
      maxSpeed: 'normal',
      initSpeed: 'normal',
      direction: 135,
      keep: true
    });
  }
}

// --- 13. Particle Background Network (Hacker Matrix Binary Code Rain for CS Students) ---
function initParticlesBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const fontSize = 14;
  let columns = Math.floor(width / fontSize);

  // drops y tracker
  let drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }

  // CS themed character sets (binary, operators, brackets, syntax)
  const symbols = "0101010101{}[]();<>+=/*!&|?".split("");

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  });

  // Track cursor location to illuminate streams
  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function draw() {
    // Draws fading trails matching global data-theme (light/dark variables)
    const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLightTheme ? 'rgba(248, 250, 252, 0.1)' : 'rgba(5, 5, 7, 0.1)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '600 ' + fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = symbols[Math.floor(Math.random() * symbols.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Neon highlight near mouse
      if (distance < 90) {
        ctx.fillStyle = isLightTheme ? 'rgba(99, 102, 241, 0.8)' : 'rgba(0, 229, 255, 0.9)';
        ctx.shadowColor = isLightTheme ? 'rgba(99, 102, 241, 0.8)' : 'rgba(0, 229, 255, 0.8)';
        ctx.shadowBlur = 6;
      } else {
        // Subtle cyber matrix stream
        ctx.fillStyle = isLightTheme ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0, 229, 255, 0.12)';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(text, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 33);
}

// --- 14. EmailJS Form Dispatcher ---
function initEmailJS() {
  emailjs.init("ue9At9kzDPwGjsre3");

  const form = document.getElementById("contact-form");
  const statusMessage = document.getElementById("form-status");
  if (!form || !statusMessage) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    statusMessage.textContent = "Sending message... ✉";
    statusMessage.style.color = "var(--accent-secondary)";
    
    const submitBtn = form.querySelector(".submit-btn");
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;

    emailjs.sendForm(
      "service_o4xxgd9",
      "template_ze4hfxd",
      this
    )
    .then(() => {
      statusMessage.textContent = "Message sent successfully! ✔";
      statusMessage.style.color = "#4fa947"; // green
      form.reset();
      
      setTimeout(() => {
        statusMessage.textContent = "";
      }, 5000);
    })
    .catch((error) => {
      console.error("EmailJS Error: ", error);
      statusMessage.textContent = "Failed to send message. Please try again.";
      statusMessage.style.color = "#e63946"; // red
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  });
}

// --- 15. Resume Preview Modal Overlay bindings ---
function initResumeModal() {
  const modal = document.getElementById("resume-modal");
  const openBtn = document.getElementById("view-resume-btn");
  const closeBtn = document.getElementById("close-resume");

  if (!modal || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    modal.classList.add("open-modal");
    document.body.style.overflow = "hidden";
  });

  const closeModal = () => {
    modal.classList.remove("open-modal");
    document.body.style.overflow = "auto";
  };

  closeBtn.addEventListener("click", closeModal);
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open-modal")) {
      closeModal();
    }
  });
}

// --- 16. Autoplay trigger helper for video backgrounds ---
function initHeroVideoAutoplay() {
  const video = document.getElementById("hero-video-bg");
  if (!video) return;

  video.play().catch(err => {
    console.log("Autoplay was prevented by browser security rules. Retrying on user interaction...", err);
    // Fallback: play as soon as there is user movement or tap
    const playFallback = () => {
      video.play();
      document.removeEventListener("click", playFallback);
      document.removeEventListener("touchstart", playFallback);
    };
    document.addEventListener("click", playFallback);
    document.addEventListener("touchstart", playFallback);
  });
}
