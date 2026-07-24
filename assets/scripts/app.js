/**
 * ENT Clinic Mobay — Shared Application Script
 * Handles navigation, drawer, and shared UI behaviors.
 */
import { initAccessibility, cycleFontSize, toggleHighContrast, setFontSize, isHighContrast, getFontSize, getFontSizeLabel } from './accessibility.js';

/* --- Navigation Drawer --- */
let drawerOpen = false;

function openDrawer() {
  drawerOpen = true;
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('mobile-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('drawer-close-btn')?.focus();
}

function closeDrawer() {
  drawerOpen = false;
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('mobile-drawer').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('hamburger-btn')?.focus();
}

/* --- Set active nav link --- */
function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.desktop-nav a, .drawer-nav a').forEach(link => {
    const href = link.getAttribute('href');
    link.removeAttribute('aria-current');
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* --- Initialize on DOM ready --- */
document.addEventListener('DOMContentLoaded', () => {
  // Set active nav link
  setActiveNav();

  // Hamburger button
  const hamburger = document.getElementById('hamburger-btn');
  if (hamburger) {
    hamburger.addEventListener('click', openDrawer);
  }

  // Drawer close button
  const closeBtn = document.getElementById('drawer-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Drawer overlay (click to close)
  const overlay = document.getElementById('drawer-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOpen) {
      closeDrawer();
    }
  });

  // Drawer nav links — close drawer on click
  document.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Font-size button
  const fontBtn = document.getElementById('font-size-btn');
  if (fontBtn) {
    fontBtn.addEventListener('click', cycleFontSize);
  }

  // Contrast toggle
  const contrastToggle = document.getElementById('contrast-toggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('click', toggleHighContrast);
  }

  // Initialize accessibility
  initAccessibility();

  // Phone FAB focus management
  const fab = document.querySelector('.phone-fab');
  if (fab) {
    fab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = fab.getAttribute('href');
      }
    });
  }
});
