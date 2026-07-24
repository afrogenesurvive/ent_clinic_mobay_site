/**
 * Accessibility Controls — Font Size & High Contrast Toggles
 * Persists settings in localStorage. Applies via data attributes on <html>.
 */

const STORAGE_KEY_SIZE = "ent-clinic-font-size";
const STORAGE_KEY_CONTRAST = "ent-clinic-high-contrast";

const FONT_SIZES = ["100", "125", "150"];
const FONT_LABELS = { 100: "A", 125: "A⁺", 150: "A⁺⁺" };

let currentFontSize = parseInt(localStorage.getItem(STORAGE_KEY_SIZE)) || 100;
let highContrast = localStorage.getItem(STORAGE_KEY_CONTRAST) === "true";

/**
 * Apply font size to the document.
 * @param {number} level - 100, 125, or 150
 */
export function setFontSize(level) {
  if (!FONT_SIZES.includes(String(level))) return;
  currentFontSize = level;
  document.documentElement.setAttribute("data-font-size", String(level));
  localStorage.setItem(STORAGE_KEY_SIZE, String(level));
  updateFontBtnLabel();
}

/**
 * Cycle to the next font size: A → A⁺ → A⁺⁺ → A
 */
export function cycleFontSize() {
  const idx = FONT_SIZES.indexOf(String(currentFontSize));
  const next = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
  setFontSize(parseInt(next));
}

/**
 * Get current font size level.
 */
export function getFontSize() {
  return currentFontSize;
}

/**
 * Get the label for the current font size.
 */
export function getFontSizeLabel() {
  return FONT_LABELS[String(currentFontSize)] || "A";
}

/**
 * Toggle high contrast mode on/off.
 */
export function toggleHighContrast() {
  highContrast = !highContrast;
  document.documentElement.setAttribute("data-theme", highContrast ? "high-contrast" : "");
  localStorage.setItem(STORAGE_KEY_CONTRAST, String(highContrast));
  updateContrastToggleState();
}

/**
 * Check if high contrast is active.
 */
export function isHighContrast() {
  return highContrast;
}

/**
 * Initialize accessibility features on page load.
 */
export function initAccessibility() {
  // Apply saved font size
  if (FONT_SIZES.includes(String(currentFontSize))) {
    document.documentElement.setAttribute("data-font-size", String(currentFontSize));
  }

  // Apply saved contrast
  if (highContrast) {
    document.documentElement.setAttribute("data-theme", "high-contrast");
  }

  // Set up the font size button
  updateFontBtnLabel();

  // Set up contrast toggle
  updateContrastToggleState();
}

/* --- Internal Helpers --- */

function updateFontBtnLabel() {
  const btn = document.getElementById("font-size-btn");
  if (btn) {
    btn.textContent = FONT_LABELS[String(currentFontSize)] || "A";
    btn.setAttribute("aria-label", `Font size: ${FONT_LABELS[String(currentFontSize)] || "A"}. Click to increase.`);
  }
}

function updateContrastToggleState() {
  const toggle = document.getElementById("contrast-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(highContrast));
    toggle.setAttribute("aria-label", highContrast ? "Disable high contrast mode" : "Enable high contrast mode");
  }
}
