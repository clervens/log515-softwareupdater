const ApplicationManager = require('../model/ApplicationManager'),
    DownloadManager = require('../model/DownloadManager'),
    _ = require('lodash'),
    dialog = require('electron').remote.dialog;

let applicationList = [];

let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);

ApplicationManager.get().then((appList) => {
  if(appList === null)
      appList = [];
  applicationList = appList;
  let htmlList = document.getElementById("applicationList");
  document.getElementById("loading").style.display = 'none';

  let appListTemplate = _.template(document.querySelector('#AppListTemplate').textContent);
  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      if(!el || !el.Name) continue;
      el.appId = el.Name.replace(/\s+/g, '_');
      let appItem = appListTemplate(el);
      //Show item only if new version if available
      $(htmlList).append(appItem);
  }

  $(htmlList).on('click', 'li .versionavailable button', (event) => {
      let $progress = $(event.target).parents('li').find('.progress');
      let $progressBar = $progress.find('.progress-bar');
      let appId = $(event.target).parents('li').attr('id').trim();
      let version = $(event.target).parents('li').find('.appversion').text().trim();
      $progress.css('display', 'block');

      //TODO remove the startic url to dynamic content
      DownloadManager.get("http://download.blender.org/release/Blender2.79/blender-2.79-windows64.msi", "blender-2.79-windows64.msi", (status, error) => {
          $progressBar.css('width', `${status.percent}%`);

          if (status.percent >= 100) {
              $progress.fadeOut('slow',null,() => {
                  $progressBar.css('width', `100%`);
              });

              // Switch icon to save update to dir to install.
              /*dialog.showSaveDialog(null, {
                  title: 'test',
                  defaultPath: `${appId} - ${version}.zip`
              },(filename) => {

              });*/

              DownloadManager.sendNotification('Software update',
                  `An new version of ${appId} has been successfully downloaded.`);
          }
      });

     console.log("onclick: " + appId);
  });
}).catch((e) => {/* On error do nothing */ console.log(e);});
