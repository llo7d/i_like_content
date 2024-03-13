console.log("Background log");

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([details.url], function (result) {
                if (result[details.url]) {
                    if (window.confirm('Are you sure you want to visit this website?')) {
                        resolve({ cancel: false });
                    } else {
                        resolve({ cancel: true });
                    }
                } else {
                    resolve({ cancel: false });
                }
            });
        });
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);