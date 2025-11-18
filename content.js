/**
 * content.js - VERSION 14.2 (THREADS BALANCED)
 * Threads-Schwelle von 25 auf 35 erhöht. LinkedIn bleibt bei 40.
 */

console.log("⏳ Social AI Filter v14.2 (Balanced): Loading...");

// --- 1. KONFIGURATION ---
const SITE_CONFIG = {
    linkedin: {
        selector: "div.feed-shared-update-v2, article, .occludable-update",
        container: document.body,
    },
    twitter: {
        selector: 'article[data-testid="tweet"]',
        container: document.body,
    },
    threads: {
        selector: 'div[data-pressable-container="true"], div[role="article"]',
        container: document.body,
    },
    facebook: {
        selector: 'div[data-ad-comet-preview="message"], div[dir="auto"]',
        container: document.body,
    },
};

// --- 2. TRIGGER LISTEN ---
const AI_KEYWORDS = [
    "game changer",
    "unlock",
    "delve into",
    "tapestry",
    "demystifying",
    "landscape of",
    "realm of",
    "poised to",
    "transformative",
    "paradigm shift",
    "eintauchen",
    "maßgeblich",
    "potenzial entfalten",
    "zusammenfassend",
    "let that sink in",
    "agree?",
    "synergien",
];

const STORY_KEYWORDS = [
    "nervenzusammenbruch",
    "aufgeben",
    "komfortzone",
    "mindset",
    "grind",
    "gegenwind",
    "widerstand",
    "schmerz",
    "stärke",
    "ausrede",
    "weckruf",
    "dankbar",
    "demut",
    "hustle",
    "charakter formen",
    "transformation",
    "journey",
    "ungefiltert",
    "geschichte erzählen",
    "raum geben",
    "ehrlich gesagt",
];

// --- 3. ANALYSE LOGIK ---

function analyzeStructureAndDrama(text) {
    let score = 0;
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (sentences.length < 3) return 0;

    // Paragraph Ratio
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const ratio = paragraphs.length / sentences.length;

    if (ratio > 0.75) score += 35;
    else if (ratio > 0.5) score += 15;

    // Drama-Zeilen
    let dramaLines = 0;
    lines.forEach((line) => {
        if (line.split(/\s+/).length <= 4) dramaLines++;
    });

    if (dramaLines >= 3) score += 15;
    if (dramaLines >= 6) score += 10;

    return score;
}

function calculateTotalScore(text) {
    const host = window.location.hostname;

    // Kurze Texte auf Threads erlauben Prüfung, brauchen aber Score
    const minLength =
        host.includes("threads") ||
        host.includes("twitter") ||
        host.includes("x.com")
            ? 30
            : 80;

    if (!text || text.length < minLength) return 0;

    let totalScore = 0;
    const lowerText = text.toLowerCase();

    // 1. Keywords
    let hits = 0;
    AI_KEYWORDS.forEach((word) => {
        if (lowerText.includes(word)) hits += 15;
    });
    STORY_KEYWORDS.forEach((word) => {
        if (lowerText.includes(word)) hits += 10;
    });
    totalScore += Math.min(hits, 50);

    // 2. Struktur
    totalScore += analyzeStructureAndDrama(text);

    return totalScore;
}

// --- 4. VISUELLES FEEDBACK ---

function markAsAI(element, score, reason) {
    if (element.dataset.marked) return;
    element.dataset.marked = "true";

    const host = window.location.hostname;
    const useBackground = host.includes("facebook") || host.includes("threads");

    // Färbung anpassen
    let isRed = score >= 60;
    if (host.includes("threads")) isRed = score >= 50; // Threads ab 50 rot

    const colorRGB = isRed ? "255, 0, 0" : "255, 165, 0";
    const colorHex = isRed ? "#ff0000" : "#ffaa00";

    if (useBackground) {
        element.style.backgroundColor = `rgba(${colorRGB}, 0.1)`;
        element.style.borderRadius = "12px";
        element.style.transition = "background-color 0.5s";
    } else {
        element.style.boxShadow = `inset 0 0 0 3px ${colorHex}`;
        element.style.borderRadius = "8px";
    }

    // Badge
    const badge = document.createElement("div");
    badge.innerHTML = `🤖 <b>${score}%</b>`;
    badge.title = `Grund: ${reason}`;
    badge.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        background: rgb(${colorRGB});
        color: white;
        font-family: sans-serif;
        font-size: 10px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
        z-index: 99999;
        pointer-events: none;
        opacity: 0.8;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    `;

    if (getComputedStyle(element).position === "static") {
        element.style.position = "relative";
    }
    element.appendChild(badge);

    console.log(`[FILTER] Treffer auf ${host} (${score}): ${reason}`);
}

// --- 5. ENGINE ---

function init() {
    const host = window.location.hostname;
    let config = null;

    if (host.includes("linkedin")) config = SITE_CONFIG.linkedin;
    else if (host.includes("twitter") || host.includes("x.com"))
        config = SITE_CONFIG.twitter;
    else if (host.includes("threads")) config = SITE_CONFIG.threads;
    else if (host.includes("facebook")) config = SITE_CONFIG.facebook;

    if (!config) return;

    console.log("✅ Social AI Filter v14.2 (Balanced) gestartet auf: " + host);

    // DYNAMISCHER THRESHOLD
    const isShortTextPlatform =
        host.includes("threads") ||
        host.includes("twitter") ||
        host.includes("x.com");

    // Threads: 35 (Kompromiss) | LinkedIn: 40
    const threshold = isShortTextPlatform ? 35 : 40;

    const runCheck = () => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el) => {
            const text = el.innerText;
            const score = calculateTotalScore(text);

            if (score >= threshold) {
                let reason = "Inhalt";
                if (analyzeStructureAndDrama(text) > 15)
                    reason += " + Struktur";
                markAsAI(el, score, reason);
            }
        });
    };

    runCheck();
    setInterval(runCheck, 1500);
}

init();
// --- ENDE DER DATEI ---
