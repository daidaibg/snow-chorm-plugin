//@ts-nocheck
import { locaEnum } from "./option.js"
let zhHtml2ImgIpt = document.getElementById("zhHtml2Img")

let defaultConfig = {
    "scale": 1.5
}
chrome.storage.local.get([locaEnum.zhHtml2img], function (result) {
    let data = result[locaEnum.zhHtml2img] || defaultConfig
    zhHtml2ImgIpt.value = JSON.stringify(data,null,4)

});

document.getElementById("ss-zh-html2img_sub").addEventListener("click", function () {
    console.log(JSON.parse(zhHtml2ImgIpt.value));
    let json = JSON.parse(zhHtml2ImgIpt.value)
    chrome.storage.local.set({ [locaEnum.zhHtml2img]: json }, function () {
        window["$message"].success({ content: '保存成功！' })
    });
})