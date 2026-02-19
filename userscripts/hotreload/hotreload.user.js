// ==UserScript==
// @name         Fluxer CSS Hot Reload
// @match        https://web.fluxer.app/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// ==/UserScript==

const PORT = 6934;

(function () {
  function applyCSS(css) {
    let el = document.getElementById("fluxer-custom-theme-style");
    if (!el) {
      el = document.createElement("style");
      el.id = "fluxer-custom-theme-style";
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  function connect() {
    GM_xmlhttpRequest({
      method: "GET",
      url: `http://127.0.0.1:${PORT}/css`,
      onprogress(res) {
        const lines = res.responseText.trim().split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              applyCSS(JSON.parse(line.slice(6)));
              console.log("[HotReload] CSS applied");
            } catch {}
          }
        }
      },
      onerror: () => setTimeout(connect, 2000),
      onabort: () => setTimeout(connect, 2000),
    });
  }

  connect();
})();
