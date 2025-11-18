/**
 * content.js - FINAL VERSION (v11.0)
 * Kombiniert: Storytelling-Erkennung, Broetry-Check & Facebook-Background-Fix.
 */

// --- 1. KONFIGURATION ---
const SITE_CONFIG = {
    linkedin: {
        selector: 'div.feed-shared-update-v2, article, .occludable-update',
        container: document.body
    },
    twitter: {
        selector: 'article[data-testid="tweet"]',
        container: document.body
    },
    threads: {
        selector: 'div[data-pressable-container="true"]',
        container: document.body
    },
    facebook: {
        // Der Mix, der bei deinem Test funktioniert hat
        selector: 'div[data-ad-comet-preview="message"], div[dir="auto"]',
        container: document.body
    }
};

// --- 2. TRIGGER LISTEN ---
const AI_KEYWORDS = [
    "game changer", "unlock", "delve into", "tapestry", "demystifying",
    "landscape of", "realm of", "poised to", "transformative",
    "paradigm shift", "eintauchen", "maßgeblich", "potenzial entfalten",
    "zusammenfassend", "let that sink in", "agree?", "synergien"
];

const STORY_KEYWORDS = [
    "nervenzusammenbruch", "aufgeben", "komfortzone", "mindset", "grind",
    "gegenwind", "widerstand", "schmerz", "stärke", "ausrede", "weckruf",
    "dankbar", "demut", "hustle", "charakter formen", "transformation"
];

// --- 3. ANALYSE LOGIK ---

function analyzeStructureAndDrama(text) {
    let score = 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length < 3) return 0;

    // A. Paragraph Ratio (Broetry-Check)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const ratio = paragraphs.length / sentences.length;

    if (ratio > 0.6) score += 30;
    else if (ratio > 0.4) score += 15;

    // B. Drama-Zeilen (Kurze, alleinstehende Zeilen)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let dramaLines = 0;
    lines.forEach(line => {
        if (line.split(/\s+/).length <= 3) dramaLines++;
    });

    if (dramaLines >= 2) score += 15;
    if (dramaLines >= 4) score += 10; // Bonus für Drama-Queens

    return score;
}

function calculateTotalScore(text) {
    if (!text || text.length < 50) return 0;

    let totalScore = 0;
    const lowerText = text.toLowerCase();

    // 1. Keywords
    let hits = 0;
    AI_KEYWORDS.forEach(word => { if (lowerText.includes(word)) hits += 15; });
    STORY_KEYWORDS.forEach(word => { if (lowerText.includes(word)) hits += 10; });
    totalScore += Math.min(hits, 50); // Max 50 Punkte durch Wörter

    // 2. Struktur
    totalScore += analyzeStructureAndDrama(text);

    return totalScore;
}

// --- 4. VISUELLES FEEDBACK ---

function markAsAI(element, score, reason) {
    if (element.dataset.marked) return;
    element.dataset.marked = "true";

    const isFacebook = window.location.hostname.includes("facebook");
