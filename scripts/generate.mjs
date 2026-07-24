/**
 * Content Generator — ENT Clinic Mobay
 *
 * Reads content.json + HTML templates (with {{placeholders}}),
 * generates final HTML files with all content injected.
 *
 * Usage:
 *   node scripts/generate.mjs
 *
 * Template syntax:
 *   {{path.to.key}}              — Simple text replacement from content.json
 *   {{#each path}}...{{/each}}   — Iterate an array, repeat the block for each item
 *   {{prop}}                     — Inside #each, references current item property
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ─── Deep object access ────────────────────────────────────────────
function getValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    if (Array.isArray(acc) && !isNaN(key)) return acc[parseInt(key)];
    return acc[key];
  }, obj);
}

// ─── Find matching {{/each}} for a {{#each}} at openIdx ────────
function findMatchingEnd(text, openIdx) {
  const startTag = "{{#each ";
  const endTag = "{{/each}}";
  let depth = 1;
  let pos = openIdx + startTag.length;
  pos = text.indexOf("}}", pos);
  if (pos === -1) return -1;
  pos += 2;

  while (depth > 0 && pos < text.length) {
    const nextOpen = text.indexOf(startTag, pos);
    const nextClose = text.indexOf(endTag, pos);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + startTag.length;
      pos = text.indexOf("}}", pos);
      if (pos === -1) return -1;
      pos += 2;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + endTag.length;
    }
  }
  return -1;
}

// ─── Find innermost #each block (no nested #each inside) ──────
function findInnermostEach(text) {
  const startTag = "{{#each ";
  let idx = 0;

  while ((idx = text.indexOf(startTag, idx)) !== -1) {
    const tagEnd = text.indexOf("}}", idx);
    if (tagEnd === -1) break;
    const path = text.slice(idx + startTag.length, tagEnd).trim();
    const closeIdx = findMatchingEnd(text, idx);
    if (closeIdx === -1) {
      idx = tagEnd + 2;
      continue;
    }
    const block = text.slice(tagEnd + 2, closeIdx);
    if (!block.includes(startTag)) {
      const fullMatch = text.slice(idx, closeIdx + "{{/each}}".length);
      return { path, block, fullMatch };
    }
    idx = tagEnd + 2;
  }
  return null;
}

// ─── Resolve a value from context, falling back to root ──────
function resolveValue(prop, mergedCtx, content) {
  // Try context first (item properties from #each), then root content
  const fromCtx = getValue(mergedCtx, prop);
  if (fromCtx !== undefined && fromCtx !== null) return String(fromCtx);
  const fromRoot = getValue(content, prop);
  if (fromRoot !== undefined && fromRoot !== null) return String(fromRoot);
  return null;
}

// ─── Process template with context-aware resolution ────────────
function processTemplate(template, content, context) {
  const ctx = context || {};

  let result = template;
  let match;

  // 1. Expand innermost #each blocks until none remain
  while ((match = findInnermostEach(result)) !== null) {
    const { path, block, fullMatch } = match;
    const arr = getValue(ctx, path) || getValue(content, path);

    if (!Array.isArray(arr)) {
      console.warn(`  ⚠ #each "${path}" is not an array — skipping`);
      result = result.replace(fullMatch, "");
      continue;
    }

    const expanded = arr
      .map((item) => {
        const mergedCtx = { ...ctx, ...item };
        return block.replace(/\{\{([\w.]+)\}\}/g, (m, prop) => {
          const val = resolveValue(prop, mergedCtx, content);
          return val !== null ? val : m;
        });
      })
      .join("\n");

    result = result.replace(fullMatch, expanded);
  }

  // 2. Replace remaining simple {{path.to.key}} placeholders
  result = result.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const fromCtx = getValue(ctx, path);
    const fromRoot = getValue(content, path);
    const val = fromCtx !== undefined && fromCtx !== null ? fromCtx : fromRoot;
    if (val === undefined || val === null) {
      console.warn(`  ⚠ Missing content key: "${path}" — keeping placeholder`);
      return match;
    }
    return String(val);
  });

  return result;
}

// ─── Main ──────────────────────────────────────────────────────────
function main() {
  console.log("🔧 Generating content from content.json...\n");

  // Read content
  const contentPath = resolve(root, "content.json");
  let content;
  try {
    content = JSON.parse(readFileSync(contentPath, "utf-8"));
    console.log("  ✅ Loaded content.json");
  } catch (err) {
    console.error("  ❌ Failed to read content.json:", err.message);
    process.exit(1);
  }

  // Find all HTML template files in root
  const files = readdirSync(root).filter((f) => f.endsWith(".html") && f !== "contact-success.html");

  if (files.length === 0) {
    console.warn("  ⚠ No HTML template files found in root");
    process.exit(0);
  }

  let processed = 0;
  let errors = 0;

  for (const file of files) {
    const filePath = resolve(root, file);
    try {
      const template = readFileSync(filePath, "utf-8");
      const output = processTemplate(template, content);
      writeFileSync(filePath, output, "utf-8");
      console.log(`  ✅ ${file}`);
      processed++;
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Done: ${processed} files processed${errors ? `, ${errors} errors` : ""}`);
}

main();
