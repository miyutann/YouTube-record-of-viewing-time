document.addEventListener('DOMContentLoaded', () => {
    const watchTimeList = document.getElementById('watchTimeList');
    
    // Load the watch time data from storage
    chrome.storage.local.get('youtubeWatchTime', (result) => {
      const youtubeWatchTime = result.youtubeWatchTime || {};
      
      // Clear the list and populate it with dates and times
      watchTimeList.innerHTML = '';
  
      if (Object.keys(youtubeWatchTime).length === 0) {
        watchTimeList.innerHTML = '<li>No data available</li>';
      } else {
        // Create a list item for each date
        Object.keys(youtubeWatchTime).sort().forEach(date => {
          const timeInSeconds = youtubeWatchTime[date];
          const timeInMinutes = Math.floor(timeInSeconds / 60);
          
          const listItem = document.createElement('li');
          listItem.textContent = `${date}：${timeInMinutes} 分`;
          watchTimeList.appendChild(listItem);
        });
      }
    });
  });
  