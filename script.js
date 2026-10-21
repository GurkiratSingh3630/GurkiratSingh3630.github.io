/* =========================================
   1. Greeting + live date & time
   ========================================= */
const greetingEl = document.getElementById("greeting-text");
const datetimeEl = document.getElementById("datetime");

function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12)      greetingEl.textContent = "Good morning!";
    else if (hour < 18) greetingEl.textContent = "Good afternoon!";
    else                greetingEl.textContent = "Good evening!";

    const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    datetimeEl.textContent = `${date} • ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================
   2. Dark mode toggle (remembers choice)
   ========================================= */
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");

function setThemeLabel() {
    themeLabel.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
}

themeBtn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    setThemeLabel();
});

setThemeLabel();


/* =========================================
   3. Mobile menu
   ========================================= */
const menuBtn = document.querySelector(".menu-btn");
const overlay = document.querySelector(".overlay");

function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
overlay.addEventListener("click", () => setMenu(false));
document.querySelectorAll(".sidebar a").forEach(link =>
    link.addEventListener("click", () => setMenu(false))
);
document.addEventListener("keydown", e => {
    if (e.key === "Escape") setMenu(false);
});


/* =========================================
   4. Highlight active nav link while scrolling
   ========================================= */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link =>
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
    });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(section => navObserver.observe(section));


/* =========================================
   5. Reveal sections on scroll
   ========================================= */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


/* =========================================
   6. Typewriter: "I'm ___"
   ========================================= */
const roles = [
    "Gurkirat",
    "a Full-Stack Developer",
    "building REST APIs with Node",
    "writing TypeScript, C# & Java",
    "designing SQL & NoSQL databases",
    "shipping real-world software"
];

const TYPE_SPEED   = 90;    // ms per letter while typing
const DELETE_SPEED = 45;    // ms per letter while deleting
const HOLD_TIME    = 1600;  // ms to pause on a finished phrase
const GAP_TIME     = 350;   // ms before typing the next phrase

const typedEl   = document.getElementById("typed");
const heroTitle = document.querySelector(".hero-title");
const hero      = document.querySelector(".hero");

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let timer      = null;

function tick() {
    const word = roles[roleIndex];

    if (!isDeleting) {
        charIndex++;
        typedEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
            isDeleting = true;
            timer = setTimeout(tick, HOLD_TIME);
            return;
        }
        timer = setTimeout(tick, TYPE_SPEED);
    } else {
        charIndex--;
        typedEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            timer = setTimeout(tick, GAP_TIME);
            return;
        }
        timer = setTimeout(tick, DELETE_SPEED);
    }
}

function skipToNext(e) {
    if (e.target.closest("a")) return;     // don't skip when clicking the buttons
    clearTimeout(timer);
    roleIndex  = (roleIndex + 1) % roles.length;
    charIndex  = 0;
    isDeleting = false;
    typedEl.textContent = "";
    heroTitle.classList.remove("pop");
    void heroTitle.offsetWidth;            // restart the pop animation
    heroTitle.classList.add("pop");
    tick();
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Accessibility: swap whole phrases, no typing animation
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        typedEl.textContent = roles[roleIndex];
    }, 2500);
} else {
    typedEl.textContent = "";
    timer = setTimeout(tick, 500);
    hero.addEventListener("click", skipToNext);
}