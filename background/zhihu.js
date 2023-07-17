//@ts-nocheck
//支知乎页面注入脚本 html2canvas.min.js
function loadHtml2Canvas() {
  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("static/vendor/html2canvas.min.js");
  script.onload = function () { };

  document.head.appendChild(script);
}

var manuscript, nameDom;

function down({scale = 1.5}) {
  if (!manuscript) {
    manuscript = document.getElementById("manuscript");
  }
  if (!nameDom) {
    nameDom = document.querySelector("h1");
  }
  document.head.innerHTML +=
    '<style id="vipyxcodecss">#vipyxcode{overflow: hidden;} #manuscript p { color:#569CD6 !important; }</style>';
  manuscript.style.color = "#fff";
  manuscript.style.padding = "16px  32px";
  return html2canvas(manuscript, {
    //superMap整个页面的节点
    backgroundColor: "#1E1E1E", //画出来的图片有白色的边框,不要可设置背景为透明色（null）
    useCORS: true, //支持图片跨域
    scale: scale, //设置放大的倍数
  }).then((canvas) => {
    //截图用img元素承装，显示在页面的上
    let src = canvas.toDataURL("image/jpg");
    if (src.length < 20) {
      remove()
      alert("放大倍数过大，图片生成失败，请尝试减小倍数")
      return Promise.reject("放大倍数过大，图片生成失败，请尝试减小倍数")
    }
    let img = new Image();
    img.src = src// toDataURL :图片格式转成 base64
    //如果你需要下载截图，可以使用a标签进行下载
    let a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = nameDom.innerText;
    a.click();
    remove()
    return img.src;
  });

  function remove(params) {
    document.querySelector("#vipyxcodecss")?.remove();
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "downLoadManuscriptImg") {
    console.log(message);
    down(message.data).then((src) => {
      sendResponse({ action: "downLoadManuscriptImg", data: src });
    }).catch((err) => {
      console.warn(err);
      sendResponse({ action: "downLoadManuscriptImg", data: err,error:true  })
    });
    return true;
  }
});

loadHtml2Canvas();
