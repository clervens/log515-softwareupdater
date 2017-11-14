const http = require('http'),
    fs = require('fs'),
    currentWindow = require('electron').remote.getCurrentWindow();

module.exports = class DownloadManager {

  static get(fileSource, destinationFilePath, progressFunction){
    if(fileSource || destinationFilePath){
      //todo
    }
    var file = fs.createWriteStream(destinationFilePath);
    file.on('finish', function() {
      file.close(cb);
    });

    let request = http.get(fileSource, function(response) {
      let dowloadedBytes = 0;
      let contentLenght = parseInt(response.headers['content-length'], 10);
      let cur = 0;
      let total = (contentLenght / 1048576).toFixed(2); //1048576 - bytes in  1Megabyte

      response.on("data", function(chunk) {
          dowloadedBytes += chunk.length;
          if(progressFunction)
          progressFunction({
            percent: (100.0 * dowloadedBytes / contentLenght).toFixed(2),
            downloadedMb: (dowloadedBytes / 1048576).toFixed(2),
            totalMb: total
          });
        });

      response.on("end", function() {
        progressFunction({
          percent: (100.0 * dowloadedBytes / contentLenght).toFixed(2),
          downloadedMb: (dowloadedBytes / 1048576).toFixed(2),
          totalMb: total
        });
      });

      response.pipe(file);
    });
  }

  static sendNotification(title, description) {
    // Skip notifications if the app view is open.
    if (currentWindow.isVisible())
      return;

    let newNotification = new Notification(title, {
      body: description,
      icon: "../assets/img/if_Download_drive_data_data_storage_hdd_hard_to_1886949.png"
    });
  }
}
