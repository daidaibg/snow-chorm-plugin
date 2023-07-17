## chrom一些方法

### captureVisibleTab截图

`chrome.tabs.captureVisibleTab(windowId, options, callback)`: 捕获指定窗口的可见选项卡的屏幕截图。截图将作为图像 URL 传递给回调函数

**options**

1. `format`（可选）：指定截图的文件格式。可以是 `"jpeg"`、`"png"` 或 `"pdf"`。默认值为 `"jpeg"`。
2. `quality`（仅适用于 JPEG 格式）（可选）：指定 JPEG 图像的质量，取值范围为 0-100。默认值为 92。
3. `width`（可选）：指定截图的宽度（以像素为单位）。如果未指定宽度，则默认使用整个选项卡的宽度。
4. `height`（可选）：指定截图的高度（以像素为单位）。如果未指定高度，则默认使用整个选项卡的高度。

```js
chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(screenshotUrl) {
  // 处理截图的回调函数
});
```

