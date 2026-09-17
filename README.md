# chatgpt-latex-copy
ChatGPT Formula to LaTeX A lightweight Chrome/Edge extension that adds one-click LaTeX copy buttons to formulas in ChatGPT.
# ChatGPT Formula to LaTeX

A lightweight Chrome / Edge extension that adds a **Copy LaTeX / 复制 LaTeX** button next to formulas rendered in ChatGPT.

一款轻量级 Chrome / Edge 浏览器扩展，可以直接复制 ChatGPT 回复中公式对应的 LaTeX 源码。

## Features

* One-click copy of LaTeX formulas from ChatGPT
* Supports inline and block formulas
* Automatically handles newly generated ChatGPT responses
* Works with Chrome and Microsoft Edge
* Enable or disable the copy button from the extension popup
* No third-party dependencies
* No formula or conversation content is uploaded to external servers
* Built with Manifest V3

## 功能

安装扩展后，ChatGPT 中的数学公式旁会自动出现：

**复制 LaTeX**

点击按钮即可直接将该公式的 LaTeX 源码复制到剪贴板。

例如 ChatGPT 显示：

$$
E = mc^2
$$

点击复制后，可以得到：

```latex
E = mc^2
```

适合将 ChatGPT 中的公式快速复制到：

* Markdown
* Typora
* Obsidian
* LaTeX 文档
* Overleaf
* Word 公式
* 学术笔记
* 技术文档

## Installation

目前可以通过 Chrome / Edge 的开发者模式安装。

### Chrome

1. 下载或 Clone 本仓库。
2. 如果下载的是 ZIP，请先解压。
3. 打开：

```text
chrome://extensions/
```

4. 开启右上角的 **Developer mode / 开发者模式**。
5. 点击 **Load unpacked / 加载已解压的扩展程序**。
6. 选择 `chatgpt-latex-copy` 文件夹。
7. 打开或刷新 ChatGPT。

### Microsoft Edge

打开：

```text
edge://extensions/
```

然后：

1. 开启 **开发人员模式**。
2. 点击 **加载解压缩的扩展**。
3. 选择本项目文件夹。
4. 刷新 ChatGPT 页面。

## Usage

打开：

https://chatgpt.com/

让 ChatGPT 输出包含数学公式的内容。

公式渲染完成后，其旁边会出现：

```text
复制 LaTeX
```

点击后按钮会短暂显示：

```text
已复制
```

LaTeX 源码此时已经进入系统剪贴板。

点击浏览器工具栏中的扩展图标，还可以打开或关闭公式复制按钮。

## How It Works

ChatGPT 当前页面中渲染后的公式并不总是保留完整的原始 TeX 信息。

为了能够复制原始公式，本扩展会在 ChatGPT 页面加载早期运行，并在浏览器本地读取 ChatGPT 当前页面收到的响应数据，从中识别：

```latex
\( ... \)
\[ ... \]
$ ... $
$$ ... $$
```

形式的 LaTeX 内容。

随后扩展将获取到的 LaTeX 源码与页面中对应的 KaTeX / MathJax 公式进行匹配，并添加复制按钮。

所有处理均在浏览器本地完成。

## Privacy

This extension does **not** send your ChatGPT conversations or formulas to any third-party server.

本扩展：

* 不包含第三方分析服务
* 不包含广告
* 不上传公式内容
* 不上传 ChatGPT 对话
* 不使用远程脚本
* 不需要单独的用户账户

扩展仅使用浏览器的 `storage` 权限保存“是否显示复制按钮”的设置。

如果浏览器开启了扩展设置同步，该布尔设置可能由浏览器自身通过账户同步，但公式和对话内容不会由本扩展上传。

## Permissions

### `storage`

用于保存：

```text
latexCopyEnabled
```

也就是扩展是否启用公式复制按钮。

扩展不需要访问浏览历史、下载记录、Cookies 或其他账户信息。

## Limitations

由于 ChatGPT 网页结构可能随时变化，本扩展可能需要随着 ChatGPT 前端更新而进行适配。

另外：

* 扩展启动前已经加载完成的旧回复，其原始 LaTeX 不一定能够恢复。
* 图片中的数学公式不会被识别。
* 普通文本中类似公式的内容不会被强制转换成 LaTeX。
* 当前主要针对 ChatGPT 的 KaTeX / MathJax 公式渲染进行处理。

如果发现 ChatGPT 更新后无法复制公式，欢迎提交 Issue。

## Development

项目没有额外的构建步骤或第三方依赖。

Clone：

```bash
git clone https://github.com/YOUR_USERNAME/chatgpt-latex-copy.git
cd chatgpt-latex-copy
```

然后直接通过浏览器扩展管理页面加载该目录即可。

主要文件：

```text
manifest.json    Extension configuration
main-world.js    Captures formula source from ChatGPT responses
content.js       Matches formulas and creates copy buttons
content.css      Copy button styles
popup.html       Extension settings interface
popup.js         Saves extension settings
```

## Contributing

Issues and Pull Requests are welcome.

如果遇到：

* ChatGPT 更新后按钮消失
* 某种公式无法复制
* 行内公式对应错误
* LaTeX 内容复制错误

可以提交 Issue，并尽量提供：

1. 出现问题的公式
2. ChatGPT 页面截图
3. 浏览器版本
4. 扩展版本

请不要在 Issue 中上传包含私人信息的 ChatGPT 对话内容。

## Disclaimer

This is an unofficial third-party browser extension and is not affiliated with or endorsed by OpenAI.

ChatGPT and related names may be trademarks of their respective owners.

## License

MIT License.
