# ChatGPT Formula to LaTeX

Chrome / Edge (Manifest V3) extension. It reads the original TeX stored by KaTeX in ChatGPT's rendered formula and places a **复制 LaTeX** button beside each formula.

## Install

1. Open `chrome://extensions` in Chrome, or `edge://extensions` in Edge.
2. Enable **Developer mode / 开发人员模式**.
3. Click **Load unpacked / 加载解压缩的扩展**.
4. Select this `chatgpt-latex-copy` folder.
5. Open or refresh ChatGPT. Find a formula, then click **复制 LaTeX**.

Use the extension popup to turn the buttons on or off. No network requests, accounts, or formula content leave your browser.

## Notes

The current ChatGPT renderer removes TeX annotations from its formula DOM. This extension therefore captures TeX from the current tab's ChatGPT conversation response and binds it to the rendered formula. It supports newly generated replies after the extension is reloaded; older replies that were already present before the extension starts may not have recoverable source. Formula-like plain text or images are intentionally not handled.
