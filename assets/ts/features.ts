import ThemeColorScheme from "ts/colorScheme";
import { renderCopyButton } from "ts/copyButton";
import { renderFootnotes } from "ts/footnotes";

let enableFootnotes = false;
if (document.currentScript) {
  enableFootnotes = document.currentScript.dataset.enableFootnotes == "true";
}

const init = () => {
  new ThemeColorScheme(document.getElementById("dark-mode-button"));
  if (enableFootnotes) {
    renderFootnotes();
  }
  if (navigator && navigator.clipboard) {
    renderCopyButton(navigator.clipboard);
  } else {
    var script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
    script.integrity = "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
    script.crossOrigin = "anonymous";
    script.onload = function () {
      renderCopyButton(clipboard);
    };

    document.body.appendChild(script);
  }
};

window.addEventListener("load", () => {
  setTimeout(function () {
    init();
  }, 0);
});
