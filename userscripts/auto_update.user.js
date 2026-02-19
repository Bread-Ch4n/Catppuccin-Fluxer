// ==UserScript==
// @author       Bread-Chan
// @name         Catppuccin Fluxer Auto-updater
// @description  This script auto updates the theme from the github.
// @version      1.1.0
// @homepageURL  https://github.com/Bread-Ch4n/Catppuccin-Fluxer
// @downloadURL  https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/userscripts/auto_update.user.js
// @namespace    https://github.com/Bread-Ch4n/Catppuccin-Fluxer
// @match        https://web.fluxer.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// ==/UserScript==

const FLAVORS = ["frappe", "latte", "macchiato", "mocha"];
const ACCENTS = [
  "blue",
  "flamingo",
  "green",
  "lavender",
  "maroon",
  "mauve",
  "peach",
  "pink",
  "red",
  "rosewater",
  "sapphire",
  "sky",
  "teal",
  "yellow",
];

// Reads from persistent GM storage, falls back to defaults
function getSelectedFlavor() {
  return GM_getValue("flavor", "mocha");
}
function getSelectedAccent() {
  return GM_getValue("accent", "mauve");
}

function getCssUrl() {
  const flavor = getSelectedFlavor();
  const accent = getSelectedAccent();
  return `https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/themes/${flavor}/${accent}.css`;
}

const CSS_PREFIX = `
/*
  You're using the Catppuccin Fluxer auto update userscript! Any modifications to this file will be overwritten!
*/
`.trimStart();

function buildSettingsPanel() {
  const panel = document.createElement("div");
  panel.id = "ctp-fluxer-settings";
  panel.innerHTML = `
    <div id="ctp-settings-inner">
      <h3 style="margin:0 0 12px">🎨 Catppuccin Fluxer</h3>

      <label>Flavor
        <select id="ctp-flavor">
          ${FLAVORS.map((f) => `<option value="${f}" ${f === getSelectedFlavor() ? "selected" : ""}>${f}</option>`).join("")}
        </select>
      </label>

      <label>Accent
        <select id="ctp-accent">
          ${ACCENTS.map((a) => `<option value="${a}" ${a === getSelectedAccent() ? "selected" : ""}>${a}</option>`).join("")}
        </select>
      </label>

      <div id="ctp-btn-row">
        <button id="ctp-save">Apply</button>
        <button id="ctp-close">Close</button>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #ctp-fluxer-settings {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 999999;
      font-family: sans-serif;
    }
    #ctp-settings-inner {
      background: var(--background-primary);
      color: var(--text-primary);
      border-radius: 12px;
      padding: 24px 28px;
      display: flex; flex-direction: column; gap: 12px;
      min-width: 240px;
      box-shadow: 0 8px 32px rgba(0,0,0,.5);
    }
    #ctp-settings-inner label {
      display: flex; flex-direction: column; gap: 4px; font-size: 13px;
    }
    #ctp-settings-inner select {
      background: var(--background-primary); color: var(--text-primary);
      border: 1px solid var(--border-color); border-radius: 6px;
      padding: 5px 8px; font-size: 14px; cursor: pointer;
    }
    #ctp-btn-row { display: flex; gap: 8px; margin-top: 4px; }
    #ctp-save, #ctp-close {
      flex: 1; padding: 7px; border: none; border-radius: 6px;
      font-size: 13px; cursor: pointer; font-weight: 600;
    }
    #ctp-save  { background: var(--button-primary-fill); color: var(--button-primary-text); }
    #ctp-close { background: var(--button-secondary-fill); color: var(--button-secondary-text); }
    #ctp-save:hover  { background: var(--button-primary-active-fill); }
    #ctp-close:hover { background: var(--button-secondary-active-fill); }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  document.getElementById("ctp-save").addEventListener("click", async () => {
    const flavor = document.getElementById("ctp-flavor").value;
    const accent = document.getElementById("ctp-accent").value;

    GM_setValue("flavor", flavor);
    GM_setValue("accent", accent);

    GM_setValue("etag", "");

    panel.remove();
    await checkForUpdates();
  });

  document
    .getElementById("ctp-close")
    .addEventListener("click", () => panel.remove());
}

function injectSettingsButton() {
  if (document.getElementById("ctp-settings-btn")) return;

  const themeSection = document.querySelector(
    '[id*="theme"] [class*="sectionContent"]',
  );
  if (!themeSection) {
    setTimeout(injectSettingsButton, 500);
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = "ctp-settings-btn-wrapper";

  const btn = document.createElement("button");
  btn.id = "ctp-settings-btn";
  btn.type = "button";
  btn.innerHTML = `<span>🎨</span> Catppuccin Theme`;

  const style = document.createElement("style");
  style.textContent = `
    #ctp-settings-btn-wrapper {
      margin-top: 12px;
    }
    #ctp-settings-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 14px;
      background: var(--background-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background .15s, border-color .15s;
    }
    #ctp-settings-btn:hover {
      background: var(--background-tertiary);
      border-color: var(--brand-primary);
    }
    #ctp-settings-btn span {
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);

  btn.addEventListener("click", buildSettingsPanel);
  wrapper.appendChild(btn);
  themeSection.appendChild(wrapper);
}

function applyCSS(css) {
  let el = document.getElementById("fluxer-custom-theme-style");
  if (!el) {
    el = document.createElement("style");
    el.id = "fluxer-custom-theme-style";
    document.head.appendChild(el);
  }
  el.textContent = css;

  let accessibilityStore =
    JSON.parse(localStorage.getItem("AccessibilityStore")) || {};
  accessibilityStore.customThemeCss = css;
  localStorage.setItem(
    "AccessibilityStore",
    JSON.stringify(accessibilityStore),
  );
}

function gmFetch(url, method = "GET") {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({ method, url, onload: resolve, onerror: reject });
  });
}

async function checkForUpdates() {
  try {
    const cssUrl = getCssUrl();
    const headRes = await gmFetch(cssUrl, "HEAD");

    const newETag = headRes.responseHeaders
      .split("\n")
      .find((h) => h.toLowerCase().startsWith("etag:"))
      ?.split(":")[1]
      ?.trim();

    const currentETag = GM_getValue("etag", "");
    const hasEverLoaded = GM_getValue("hasEverLoaded", false);

    if (!newETag || newETag !== currentETag) {
      const cssRes = await gmFetch(cssUrl);
      const fullCSS = `/* ETAG: ${newETag} */\n${CSS_PREFIX}${cssRes.responseText}`;
      applyCSS(fullCSS);
      GM_setValue("etag", newETag);
      console.log("[Catppuccin Fluxer] Theme updated, new ETag:", newETag);
    } else {
      const storedCSS =
        JSON.parse(localStorage.getItem("AccessibilityStore"))
          ?.customThemeCss || "";
      if (storedCSS) applyCSS(storedCSS);
      console.log("[Catppuccin Fluxer] Theme already up to date!");
    }

    if (!hasEverLoaded) {
      GM_setValue("hasEverLoaded", true);
      location.reload();
    }
  } catch (err) {
    console.error("[Catppuccin Fluxer] Update check failed:", err);
    const storedCSS =
      JSON.parse(localStorage.getItem("AccessibilityStore"))?.customThemeCss ||
      "";
    if (storedCSS) applyCSS(storedCSS);
  }
}

setInterval(checkForUpdates, 60 * 60 * 1000);
checkForUpdates();

if (document.body) {
  injectSettingsButton();
} else {
  document.addEventListener("DOMContentLoaded", injectSettingsButton);
}
