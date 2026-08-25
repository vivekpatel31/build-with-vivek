/*-----------------------------------------------------------------------------------

    Vanilla JS, no jQuery / GSAP / Swiper. Only what this page uses:
    nav + hamburger menu, in-page smooth scroll, scroll-to-top progress
    button, a native scroll-snap carousel, and an IntersectionObserver
    scroll-reveal (transform/opacity only).

-----------------------------------------------------------------------------------*/

import "devicon/devicon.min.css";

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* ================= Navbar scroll state ================= */

        var navbar = document.querySelector(".navbar");

        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                navbar.classList.add("nav-scroll");
            } else {
                navbar.classList.remove("nav-scroll");
            }
        }, { passive: true });

        var navbarToggler = document.querySelector(".navbar-toggler");
        var navbarCollapse = document.querySelector(".navbar-collapse");

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener("click", function () {
                navbarCollapse.classList.toggle("show");
            });
        }

        /* ================= In-page smooth scroll nav ================= */
        /* Sections carry data-scroll-index="0..N"; nav links carry
           data-scroll-nav pointing at the matching index. */

        var sections = document.querySelectorAll("[data-scroll-index]");
        var navTargets = document.querySelectorAll("[data-scroll-nav]");

        function scrollToSection(index) {
            var target = document.querySelector('[data-scroll-index="' + index + '"]');
            if (!target) return;
            var top = target.getBoundingClientRect().top + window.pageYOffset - 75;
            window.scrollTo({ top: top, behavior: "smooth" });
        }

        navTargets.forEach(function (el) {
            el.addEventListener("click", function (e) {
                var index = el.getAttribute("data-scroll-nav");
                if (index === null) return;
                e.preventDefault();
                scrollToSection(index);
            });
        });

        function updateActiveNav() {
            var scrollPos = window.scrollY + 80;
            var current = null;
            sections.forEach(function (section) {
                if (section.offsetTop <= scrollPos) {
                    current = section.getAttribute("data-scroll-index");
                }
            });
            if (current === null) return;
            navTargets.forEach(function (el) {
                el.classList.toggle("active", el.getAttribute("data-scroll-nav") === current);
            });
        }

        window.addEventListener("scroll", updateActiveNav, { passive: true });
        updateActiveNav();

        /* ================= Scroll-to-top progress button ================= */

        var progressWrap = document.querySelector(".progress-wrap");
        var progressPath = document.querySelector(".progress-wrap path");

        if (progressWrap && progressPath) {
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = "none";
            progressPath.style.strokeDasharray = pathLength + " " + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = "stroke-dashoffset 10ms linear";

            var updateProgress = function () {
                var scroll = window.scrollY;
                var height = document.documentElement.scrollHeight - window.innerHeight;
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;

                if (scroll > 150) {
                    progressWrap.classList.add("active-progress");
                } else {
                    progressWrap.classList.remove("active-progress");
                }
            };

            updateProgress();
            window.addEventListener("scroll", updateProgress, { passive: true });

            progressWrap.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        /* ================= Carousels (native scroll-snap) ================= */

        document.querySelectorAll(".swiper-wrapper").forEach(function (track) {
            var section = track.closest("section");
            if (!section) return;

            var prevBtn = section.querySelector(".swiper-button-prev");
            var nextBtn = section.querySelector(".swiper-button-next");
            var slide = track.querySelector(".swiper-slide");

            function step() {
                var gap = parseFloat(getComputedStyle(track).gap) || 0;
                return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth;
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", function () {
                    track.scrollBy({ left: -step(), behavior: "smooth" });
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener("click", function () {
                    track.scrollBy({ left: step(), behavior: "smooth" });
                });
            }
        });

        /* ================= Scroll reveal ================= */

        var revealEls = document.querySelectorAll(".reveal");

        if (!revealEls.length) return;

        if (!("IntersectionObserver" in window)) {
            revealEls.forEach(function (el) { el.classList.add("is-visible"); });
            return;
        }

        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        revealEls.forEach(function (el) { revealObserver.observe(el); });

    });
})();
