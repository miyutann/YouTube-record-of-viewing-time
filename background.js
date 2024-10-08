chrome.runtime.onInstalled.addListener(() => { // When the extension is installed...
    chrome.storage.local.set({ youtubeWatchTime: {} });
  });
  
  function saveWatchTime(watchTime) {    
    //const today = new Date().toISOString().split('T')[0].replaceAll("-", "/"); // Get today's date (YYYY-MM-DD)
    const today = new Date();
    today.setHours(today.getHours() + 9); // UTCに9時間足して日本時間にする
    const japanDate = today.toISOString().split('T')[0].replaceAll("-", "/"); // YYYY/MM/DDの形式に変換    

    // Get the current stored watch time
    chrome.storage.local.get("youtubeWatchTime", (result) => {
      let youtubeWatchTime = result.youtubeWatchTime || {}; // Ensure it's defined as an object
      
      // Update today's watch time
      youtubeWatchTime[japanDate] = (youtubeWatchTime[japanDate] || 0) + watchTime;
  
      // Save the updated watch time back to storage
      chrome.storage.local.set({ youtubeWatchTime }, () => {
        console.log(`Watch time updated: ${youtubeWatchTime[japanDate]} seconds for ${japanDate}`);
      });
    });
  };
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateWatchTime") {
      saveWatchTime(message.watchTime);
    }
  });

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
});
