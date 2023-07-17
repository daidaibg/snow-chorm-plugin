//@ts-nocheck
import { locaEnum } from "../options/option.js"

export const html2img = (wrapLoadingDom) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        wrapLoadingDom.style.display = "block";
        chrome.storage.local.get([locaEnum.zhHtml2img], function (result) {
            let data = result[locaEnum.zhHtml2img] || {}
            chrome.tabs.sendMessage(activeTab.id, { action: "downLoadManuscriptImg", data: data }, function (response) {
                if (response) {
                    // 在这里处理页面返回的响应数据
                    wrapLoadingDom.style.display = "none";
                    console.log(response);
                }
            }
            );
        });

        chrome.storage.local.get("tasdasd", function (result) {
            console.log("tasdasd", result);
        }
        );
    });
}