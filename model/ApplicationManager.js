const wmic = require('wmic-js'),
      currentWindow = require('electron').remote.getCurrentWindow();

module.exports = class ApplicationManager {
  static get(){
    if (process.platform == 'darwin')
      return Promise.resolve([{
        Name: "123 app technique.",
        Version: "2.3.4.5.2.4"
      }]);
    return wmic().alias('product').find().get().catch((e) => {
      console.log('An error occurred while trying to fetch applications list\n'
          + 'Check if you\'re on the right OS (Windows only).');
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
