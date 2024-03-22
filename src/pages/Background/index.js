// console.log("Background log");

let domainChangeCounter = 0;
let domainChanges = 10;

// Store the domainChangeCounter inside chrome storage
chrome.storage.local.get(['domainChanges'], function (result) {
  // If the domainChanges value is already set, use it, if not set it to 10
  if (result.domainChanges) {
    domainChanges = result.domainChanges;
  }
  chrome.storage.local.set({ domainChanges: domainChanges });
  console.log("Value currently is " + domainChanges);


});

// Listen for changes to Chrome storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.domainChanges) {
    domainChanges = changes.domainChanges.newValue;
    console.log(domainChanges);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    domainChangeCounter++;

    console.log(domainChangeCounter);
    console.log("Domainchanges: ", domainChanges);

    // If the domainChangeCounter reaches the domainChanges value, reset the counter
    if (domainChangeCounter >= domainChanges) {
      domainChangeCounter = 0;
      console.log("Domainchanges reset");
    }
  }
});


