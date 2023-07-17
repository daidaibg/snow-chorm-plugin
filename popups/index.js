//@ts-nocheck
import { html2img } from "./html2img.js"

let listWrapDom = document.querySelector(".dd-plugin-list");
const wrapLoadingDom = document.querySelector(".ss-loading");

const tools = [
    {
        name: "知乎",
        icon: "icon1",
        type: "zh",
        children: [{ name: "严选文章转图片", icon: "icon1", type: "html2img" }],
    },
]

document.querySelector('.ss-setting').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
    // 创建一个新的标签页并打开插件的单独页面
    
    // chrome.tabs.create({ url: '/setting/settting.html' });
});

function onTool(onData) {
    console.log(onData);
    if (onData.type == "html2img") {
        html2img(wrapLoadingDom)
    }
}

const init = () => {
    let innerHTML = "";
    tools.forEach((item) => {
        innerHTML += `<li class="dd-plugin-tools-item">
        <div class="">${item.name}</div>
        <ul class="dd-plugin-sub-tools">
            ${item.children.map((child) => {
            return `<li class="dd-plugin-sub-toos-item" dd-data="${encodeURI(JSON.stringify(child))}">
                <div class="tool-sub-item-name">${child.name}</div>
            </li>`;
        }).join("")}
        </ul>
    </li>`;
    });
    if (listWrapDom) {
        listWrapDom.innerHTML = innerHTML;
        listWrapDom.addEventListener("click", (e) => {
            let target = e.target;
            if (target.classList.contains("tool-sub-item-name")) {
                let type = target.parentNode.getAttribute("dd-data");
                onTool(JSON.parse(decodeURI(type)));
            }
        }
        );
    }

}

init();