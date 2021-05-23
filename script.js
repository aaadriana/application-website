"use strict";

// Selecting elements;
const parent = document.querySelector("body");
const navbar = document.querySelector(".navbar");
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".btn-close-modal");
const btnsOpenModal = document.querySelectorAll(".btn-show-modal");
const overlay = document.querySelector(".overlay");
const darkBtn = document.querySelector(".btn-dark-mode");
const lightBtn = document.querySelector(".btn-light-mode");
const btnMoreDetails = document.querySelector(".btn-more-details");
const sector1 = document.querySelector("#sector-1");
const tabs = document.querySelectorAll(".links-tab");
const tabsContainer = document.querySelector(".links-tab-container");
const tabsContent = document.querySelectorAll(".links-content");

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Dark/Light Mode
const lightMode = function (e) {
  e.preventDefault();
  darkBtn.classList.remove("hidden");
  lightBtn.classList.add("hidden");
  parent.classList.remove("dark-theme");
};

const darkMode = function (e) {
  e.preventDefault();
  darkBtn.classList.add("hidden");
  lightBtn.classList.remove("hidden");
  parent.classList.add("dark-theme");
};

darkBtn.addEventListener("click", darkMode);
lightBtn.addEventListener("click", lightMode);

// Button scrolling
btnMoreDetails.addEventListener("click", function (e) {
  sector1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation // Event delegation
// event bubbling, for performance reasons
document.querySelector(".navbar-links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("navbar-link")) {
    const id = e.target.getAttribute("href"); /// only want that part, no absolute URL
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Navbar fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("navbar-link")) {
    const link = e.target;
    const siblings = link.closest(".navbar").querySelectorAll(".navbar-link");
    const logo = link.closest(".navbar").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

navbar.addEventListener("mouseover", handleHover.bind(0.5));
navbar.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation
const header = document.querySelector(".header");
const navHeight = navbar.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSectors = document.querySelectorAll(".sector");

const revealSector = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("sector-hidden");
  observer.unobserve(entry.target);
};

const sectorObserver = new IntersectionObserver(revealSector, {
  root: null,
  threshold: 0.25,
});

allSectors.forEach(function (sector) {
  sectorObserver.observe(sector);
  sector.classList.add("sector-hidden");
});

// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider-btn-left");
  const btnRight = document.querySelector(".slider-btn-right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots-dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots-dot")
      .forEach((dot) => dot.classList.remove("dots-dot-active"));

    document
      .querySelector(`.dots-dot[data-slide="${slide}"]`)
      .classList.add("dots-dot-active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots-dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".links-tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("links-tab-active"));
  tabsContent.forEach((c) => c.classList.remove("links-content-active"));

  // Activate tab
  clicked.classList.add("links-tab-active");

  // Activate content area
  document
    .querySelector(`.links-content-${clicked.dataset.tab}`)
    .classList.add("links-content-active");
});
