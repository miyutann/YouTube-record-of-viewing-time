let watchTime = 0;
let watchingVideo = false;
let timer;

// Check every second if the user is watching a video
function checkIfWatching() {
  const video = document.querySelector('video');
  
  if (video && !video.paused && !watchingVideo) {
    watchingVideo = true;
    timer = setInterval(() => {
      watchTime++;
    }, 1000); // Increment watch time by 1 second every second
  } else if (video && video.paused && watchingVideo) {
    watchingVideo = false;
    clearInterval(timer);
    reportWatchTime();
  }
}

// Send watch time to the background script every time the user pauses or leaves the video
function reportWatchTime() {
  chrome.runtime.sendMessage({ action: "updateWatchTime", watchTime: watchTime });
  watchTime = 0; // Reset the watch time after sending
}

// Set interval to constantly check the video status
setInterval(checkIfWatching, 1000);

// Report watch time when the user leaves the page
//window.addEventListener("beforeunload", reportWatchTime);

// YouTubeのページが閉じられる直前に視聴時間を送信
window.addEventListener('beforeunload', function() {
  clearInterval(timer); // タイマーを停止
  chrome.runtime.sendMessage({ action: "updateWatchTime", watchTime: watchTime }, function(response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending watch time:", chrome.runtime.lastError);
    } else {
      console.log("Watch time sent before page unload:", watchTime);
    }
  });
});
