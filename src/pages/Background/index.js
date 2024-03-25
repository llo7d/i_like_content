// // Check ifisPluginActive is true or false if its false return
// chrome.storage.local.get(['isPluginActive'], function (result) {
//   if (result.isPluginActive === false) {
//     return;
//   }
// });

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

  // Grab the activePlugin from chrome storage , If the activPlugin value is already set, use it, if not set it to True
  chrome.storage.local.get(['isPluginActive'], function (result) {
    if (result.isPluginActive === undefined) {
      chrome.storage.local.set({ isPluginActive: true });
    }
  });


});

// Listen for changes to Chrome storage to update the domainChanges value if it changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.domainChanges) {
    domainChanges = changes.domainChanges.newValue;
    console.log(domainChanges);
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  // chrome.storage.local.get('isPluginActive', (data) => {
  //   // If the plugin is not active, return
  //   if (!data.isPluginActive) {
  //     return;
  //   }
  // });

  if (changeInfo.url) {
    domainChangeCounter++;

    console.log(domainChangeCounter);
    console.log("Domainchanges: ", domainChanges);


    // If domain name ends with /newtab.htm ignore it
    if (changeInfo.url.includes('newtab.html')) {
      return;
    }

    // If the domainChangeCounter reaches the domainChanges value, reset the counter
    if (domainChangeCounter >= domainChanges) {
      domainChangeCounter = 0;
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('newtab.html') });
    }

    // Store the URL inside chrome storage
    chrome.storage.local.set({ url: changeInfo.url });


    // grab the chrome storage and log it
    chrome.storage.local.get('url', (data) => {
      console.log(data.url);
    });

  }
});

