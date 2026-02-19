// ==UserScript==
// @name         Catppuccin Fluxer Auto-updater
// @description  This script auto updates the theme from the github.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://web.fluxer.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @homepageURL https://github.com/Bread-Ch4n/Catppuccin-Fluxer
// @downloadURL https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/userscripts/auto_update.user.js
// ==/UserScript==

const CSS_URL =
  "https://raw.githubusercontent.com/Bread-Ch4n/Catppuccin-Fluxer/refs/heads/main/mauve.css";

const CSS_PREFIX = `
/*
  You're using the Catppuccin Fluxer auto update userscript! Any modifications to this file will be overwritten!
*/
`.trimStart();

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
    GM_xmlhttpRequest({
      method,
      url,
      onload: resolve,
      onerror: reject,
    });
  });
}

async function checkForUpdates() {
  try {
    const headRes = await gmFetch(CSS_URL, "HEAD");

    const newETag = headRes.responseHeaders
      .split("\n")
      .find((h) => h.toLowerCase().startsWith("etag:"))
      ?.split(":")[1]
      ?.trim();

    let currentETag = null;
    const storedCSS =
      JSON.parse(localStorage.getItem("AccessibilityStore"))?.customThemeCss ||
      "";
    const firstLine = storedCSS.split("\n")[0];
    if (firstLine.startsWith("/* ETAG:")) {
      currentETag = firstLine.replace("/* ETAG:", "").replace("*/", "").trim();
    }

    if (newETag && newETag !== currentETag) {
      const cssRes = await gmFetch(CSS_URL);
      applyCSS(`/* ETAG: ${newETag} */\n${CSS_PREFIX}${cssRes.responseText}`);
      console.log("[Catppuccin Fluxer] Theme updated, new ETag:", newETag);
    } else {
      if (storedCSS) applyCSS(storedCSS);
      console.log("[Catppuccin Fluxer] Theme already up to date!");
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
