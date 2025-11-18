/**
 * content.js - VERSION 9.0 (STORYTELLER EDITION)
 * Fängt auch emotionale "Heldengeschichten" ohne Business-Buzzwords.
 */

// --- 1. CONFIG ---
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
        selector: 'div[data-pressable-container="true"]',
        container: document.body,
    },
    facebook: { selector: 'div[dir="auto"]', container: document.body },
};

// --- 2. TRIGGER LISTEN ---

// Klassische KI & Business Wörter
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
];

// NEU: Emotionale Storytelling-Wörter (Die "Heldereise")
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
    "tacheles",
    "klartext",
];

// --- 3. ANALYSE ---

function analyzeStructureAndDrama(text) {
    let score = 0;
    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (sentences.length < 4) return 0;

    // A. Paragraph Ratio (Die "Luftigkeit")
    // Wie viele Absätze pro Satz?
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const ratio = paragraphs.length / sentences.length;

    if (ratio > 0.7)
        score += 35; // Extrem (Fast jeder Satz ein Absatz)
    else if (ratio > 0.5) score += 20; // Hoch

    // B. Drama-Zeilen Check (NEU)
    // Zählt Zeilen, die extrem kurz sind (1-3 Wörter) und allein stehen.
    // Beispiel: "Heute?", "Aber:", "Fakt ist."
    let dramaLines = 0;
    lines.forEach((line) => {
        const wordCount = line.split(/\s+/).length;
        if (wordCount <= 3) dramaLines++;
    });

    // Wenn mehr als 2 solcher "Drama-Pausen" vorkommen -> Punkte
    if (dramaLines >= 2) score += 15;
    if (dramaLines >= 4) score += 10; // Bonus für übertriebenes Drama

    // C. Hook & Sign-off
    const firstLine = lines[0];
    const lastLine = lines[lines.length - 1];

    // Kurze Hook (< 8 Wörter)
    if (firstLine.split(/\s+/).length < 8) score += 10;

    // Sign-off ohne Punkt (z.B. "Deine Jay")
    if (
        lastLine.length < 30 &&
        !lastLine.endsWith(".") &&
        !lastLine.endsWith("!")
    ) {
        score += 5;
    }

    return score;
}

function calculateKeywordScore(text) {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Business Buzzwords
    AI_KEYWORDS.forEach((word) => {
        if (lowerText.includes(word)) score += 15;
    });

    // Story Buzzwords (NEU)
    STORY_KEYWORDS.forEach((word) => {
        if (lowerText.includes(word)) score += 10;
    });

    return Math.min(score, 50); // Cap
}

// --- 4. HAUPT-SCORE ---

function calculateTotalScore(text) {
    if (!text || text.length < 50) return 0;

    let totalScore = 0;

    // 1. Keywords (Business + Story)
    totalScore += calculateKeywordScore(text);

    // 2. Struktur & Drama
    totalScore += analyzeStructureAndDrama(text);

    return totalScore;
}

// --- 5. UI ---

function markAsAI(element, score, reason) {
    if (element.dataset.marked) return;
    element.dataset.marked = "true";

    // Score Threshold 45
    const color = score >= 65 ? "#ff0000" : "#ffaa00";

    element.style.boxShadow = `inset 0 0 0 3px ${color}`;
    element.style.borderRadius = "8px";

    const badge = document.createElement("div");
    badge.innerHTML = `📖 <b>KI-unterstützt: (${score})</b>`;
    badge.title = `Indizien: ${reason}`;
    badge.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        background: ${color};
        color: white;
        font-family: sans-serif;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 99999;
        pointer-events: none;
        opacity: 0.95;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    if (getComputedStyle(element).position === "static") {
        element.style.position = "relative";
    }
    element.appendChild(badge);

    console.log(`[STORY HIT] ${reason} | Score: ${score}`);
}

// --- 6. ENGINE ---

function init() {
    const host = window.location.hostname;
    let config = null;
    if (host.includes("linkedin")) config = SITE_CONFIG.linkedin;
    else if (host.includes("twitter") || host.includes("x.com"))
        config = SITE_CONFIG.twitter;
    else if (host.includes("threads")) config = SITE_CONFIG.threads;
    else if (host.includes("facebook")) config = SITE_CONFIG.facebook;

    if (!config) return;

    console.log("📖 Storyteller-Hunter v9.0 aktiv auf: " + host);

    const runCheck = () => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el) => {
            const text = el.innerText;
            const score = calculateTotalScore(text);

            // Threshold bei 45 lassen
            if (score >= 45) {
                let reason = "Struktur";
                if (
                    text.toLowerCase().includes("nervenzusammenbruch") ||
                    text.toLowerCase().includes("grind")
                )
                    reason = "Storytelling-Wörter";
                if (analyzeStructureAndDrama(text) >= 30)
                    reason += " + Drama-Formatierung";

                markAsAI(el, score, reason);
            }
        });
    };

    runCheck();
    setInterval(runCheck, 2000);
}

init();
