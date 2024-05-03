let domainChangeCounter = 0;
let domainChanges;

// When the extension is installed, set default values.
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    isPluginActive: true,
    difficulty: 'easy',
    category: 'javascript',
    domainChanges: 10,
    excludedDomains: ['gmail', 'slack', 'stackoverflow', 'hackernews'],
    seenQuestions: [],
  });
});

// Fetch the domainChanges and isPluginActive values from chrome storage
chrome.storage.local.get(
  ['domainChanges', 'isPluginActive'],
  function (result) {
    // Set domainChanges to the stored value or default to 15
    domainChanges = result.domainChanges ?? 1;
    console.log('🚀 ~ domainChanges:', domainChanges);

    // If isPluginActive is undefined, set it to true
    if (result.isPluginActive === undefined) {
      chrome.storage.local.set({ isPluginActive: true });
    }
  }
);

// Listen for changes to Chrome storage to update the domainChanges value if it changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.domainChanges) {
    domainChanges = changes.domainChanges.newValue;
  }
});

// Listen for changes to the URL of the active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    // Extract the domain from the URL
    const url = new URL(changeInfo.url);
    const domain = url.hostname;

    console.log('changeInfo', changeInfo);
    // If domain name ends with /newtab.htm ignore it
    if (
      changeInfo.url.includes('newtab.html') ||
      changeInfo.url === 'about:blank' ||
      changeInfo.url === 'chrome://newtab/' ||
      changeInfo.url === '' ||
      domain === 'newtab' ||
      domain === 'localhost' ||
      domain === 'mail.google.com'
    ) {
      return;
    }

    // Check if the plugin is active before incrementing domainChangeCounter and storing the URL
    chrome.storage.local.get(
      ['isPluginActive', 'excludedDomains', 'pausedTime'],
      function (result) {
        if (
          result.isPluginActive &&
          !result.excludedDomains.some((excludedDomain) =>
            domain.includes(excludedDomain)
          )
        ) {
          domainChangeCounter++;

          console.log('Domain change counter:', domainChangeCounter);
          console.log('Domain changes:', domainChanges);
          console.log('pausedTime:', result?.pausedTime);
          // paused time > time now then do not open new tab
          if (result.pausedTime && result.pausedTime > new Date().getTime()) {
            console.log('Plugin is paused');
            return;
          }

          // If the domainChangeCounter reaches the domainChanges value, reset the counter and open a new tab
          if (domainChangeCounter >= domainChanges) {
            domainChangeCounter = 0;
            chrome.tabs.update(tabId, {
              url: chrome.runtime.getURL('newtab.html'),
            });
          }

          // Store the URL inside chrome storage
          chrome.storage.local.set({ url: changeInfo.url });
        }
      }
    );
  }
});
