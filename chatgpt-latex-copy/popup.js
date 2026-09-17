const key = "latexCopyEnabled";
const checkbox = document.querySelector("#enabled");

chrome.storage.sync.get({ [key]: true }, (settings) => {
  checkbox.checked = settings[key];
});

checkbox.addEventListener("change", () => {
  chrome.storage.sync.set({ [key]: checkbox.checked });
});
