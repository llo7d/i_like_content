console.log("Background log");

let domainChangeCounter = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    domainChangeCounter++;
    // console.log("Domain changed");
    // console.log(tab.url);
    // console.log(tabId);
    // console.log(changeInfo);

    if (domainChangeCounter === 10) {
      console.log("Bingo");
      domainChangeCounter = 0;
    }
  }
});


