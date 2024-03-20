console.log("Background log");

// On everydomain change, log something happned
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Domain changed");
  console.log(tab.url);
  console.log(tabId);
  console.log(changeInfo);
});
