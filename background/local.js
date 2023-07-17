//@ts-nocheck
class ssLocal {
    constructor() {
    }

    set(key, value) {
        chrome.storage.local.set({ [key]: value }, function () {
            console.log('保存成功！');
        }
        );
    }

    get(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, function (result) {
                resolve(result[key]);
            }
            );
        });
    }

    remove(key) {
        chrome.storage.local.remove(key, function () {
            console.log('删除成功！');
        }
        );
    }
}

export default new ssLocal();