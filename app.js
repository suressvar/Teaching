/**
 * APP.JS - Lovable AI Interactive Workshop Aid
 * Features: GSAP ScrollTrigger, Scroll-Spy, Interactive Prompt Builder, Step Progress Bar, FAQ Accordion, Mobile Menu
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSmoothScroll();
  initPromptBuilder();
  initCopyPrompt();
  initFaqAccordion();
  initGsapAnimations();
});

/* --------------------------------------------------------------------------
   1. Mobile Hamburger Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    toggleBtn.classList.toggle("open", isOpen);
    toggleBtn.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      toggleBtn.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* --------------------------------------------------------------------------
   2. Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Master Prompt Builder
   -------------------------------------------------------------------------- */
function initPromptBuilder() {
  const inputName = document.getElementById("inputName");
  const inputRole = document.getElementById("inputRole");
  const inputBio = document.getElementById("inputBio");
  const inputSkills = document.getElementById("inputSkills");
  const inputProjects = document.getElementById("inputProjects");
  const inputContact = document.getElementById("inputContact");

  const promptDisplay = document.getElementById("promptText");
  if (!promptDisplay) return;

  const defaultValues = {
    name: "[YOUR NAME]",
    role: "[YOUR ROLE]",
    bio: "[2-3 sentences]",
    skills: "[list]",
    projects: "[up to 3 with name, description, link]",
    contact: "[email/social links]",
  };

  function updatePrompt() {
    const nameVal = (inputName && inputName.value.trim()) || defaultValues.name;
    const roleVal = (inputRole && inputRole.value.trim()) || defaultValues.role;
    const bioVal = (inputBio && inputBio.value.trim()) || defaultValues.bio;
    const skillsVal = (inputSkills && inputSkills.value.trim()) || defaultValues.skills;
    const projectsVal = (inputProjects && inputProjects.value.trim()) || defaultValues.projects;
    const contactVal = (inputContact && inputContact.value.trim()) || defaultValues.contact;

    const formattedPrompt = `Build a single-page personal portfolio website with a playful yet professional feel. MY DETAILS: Name: <mark>${escapeHtml(nameVal)}</mark>, Tagline: <mark>${escapeHtml(roleVal)}</mark>, Bio: <mark>${escapeHtml(bioVal)}</mark>, Skills: <mark>${escapeHtml(skillsVal)}</mark>, Projects: <mark>${escapeHtml(projectsVal)}</mark>, Contact: <mark>${escapeHtml(contactVal)}</mark>. Include Hero, About, Projects, and Contact sections. Use a light blue and dark blue color palette with white background, neomorphic soft-UI cards, clean system fonts, subtle scroll animations, and full mobile/laptop responsiveness. Keep the code lightweight and efficient.`;

    promptDisplay.innerHTML = formattedPrompt;
  }

  const inputs = [inputName, inputRole, inputBio, inputSkills, inputProjects, inputContact];
  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", updatePrompt);
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* --------------------------------------------------------------------------
   4. Copy to Clipboard Functionality
   -------------------------------------------------------------------------- */
function initCopyPrompt() {
  const copyBtn = document.getElementById("copyPromptBtn");
  const promptCode = document.getElementById("promptText");

  if (!copyBtn || !promptCode) return;

  copyBtn.addEventListener("click", async () => {
    // Extract plain text
    const textToCopy = promptCode.innerText || promptCode.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        textarea.style.top = "-999999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `<span>Copied! ✅</span>`;
      copyBtn.classList.add("copied");

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.classList.remove("copied");
      }, 2500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Please select and copy the prompt text manually.");
    }
  });
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others
      faqItems.forEach((other) => {
        other.classList.remove("open");
        const btn = other.querySelector(".faq-question");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. GSAP Animations, Scroll-Spy & Step Progress Line
   -------------------------------------------------------------------------- */
function initGsapAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP / ScrollTrigger not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // If user prefers reduced motion, skip decorative entrance animations
  if (!prefersReducedMotion) {
    // Hero Section Entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero-badge", { y: -20, opacity: 0, duration: 0.7 })
      .from(".hero-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-actions", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
      .from(".hero-visual-flow", { scale: 0.9, opacity: 0, duration: 0.6 }, "-=0.3");

    // Generic Section Headers Fade-Up
    gsap.utils.toArray(".section-header").forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    // What is Lovable Section
    gsap.utils.toArray(".what-grid > div").forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        delay: index * 0.08,
        ease: "power2.out",
      });
    });

    // How It Works Cards
    gsap.utils.toArray(".how-card").forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        delay: (index % 2) * 0.08,
        ease: "power2.out",
      });
    });

    // Step-by-Step Guide Cards Entrance
    const stepCards = gsap.utils.toArray(".step-card");
    stepCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        x: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    // Prompt Section
    gsap.utils.toArray(".prompt-builder-card, .prompt-box, .breakdown-card").forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    // Tips & Common Mistakes
    gsap.utils.toArray(".tip-item-card").forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        delay: (index % 3) * 0.06,
        ease: "power2.out",
      });
    });

    // FAQ Items
    gsap.utils.toArray(".faq-item").forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 95%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        delay: index * 0.06,
        ease: "power2.out",
      });
    });
  }

  // Functional features: Step progress and step active highlights (kept for both regular and reduced motion)
  const stepCards = gsap.utils.toArray(".step-card");
  stepCards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => card.classList.add("active-step"),
      onLeave: () => card.classList.remove("active-step"),
      onEnterBack: () => card.classList.add("active-step"),
      onLeaveBack: () => card.classList.remove("active-step"),
    });
  });

  // Progress Fill along the Step-by-Step section
  const guideWrapper = document.querySelector(".guide-wrapper");
  const progressFill = document.getElementById("stepProgressFill");
  if (guideWrapper && progressFill) {
    ScrollTrigger.create({
      trigger: guideWrapper,
      start: "top 70%",
      end: "bottom 70%",
      onUpdate: (self) => {
        progressFill.style.height = `${self.progress * 100}%`;
      },
    });
  }

  // Scroll-Spy: Highlight active navbar item as user scrolls
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveNav(navLink),
        onEnterBack: () => setActiveNav(navLink),
      });
    }
  });

  function setActiveNav(activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
    activeLink.classList.add("active");
  }
}
