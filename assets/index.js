const ApplicationManager = require('../model/ApplicationManager'),
    DownloadManager = require('../model/DownloadManager'),
    _ = require('lodash'),
    dialog = require('electron').remote.dialog,
    config = require('config'),
    path = require('path'),
    merge = require('merge'),
    spawn = require('child_process').spawn;

let applicationList = [];

let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);

ApplicationManager.get().then((appList) => {
  if(appList === null)
      appList = [];
  applicationList = appList;
  let dowloadedAppPath = config.get('dowloadedApplicationFolder');
  let htmlList = document.getElementById("applicationList");
  document.getElementById("loading").style.display = 'none';

  let appListTemplate = _.template(document.querySelector('#AppListTemplate').textContent);
  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      if(!el || !el.Name) continue;
      //it's important to keep information on the main object
      el.appId = el.Name.replace(/\s+/g, '_');
      let appItem = appListTemplate(el);
      //Show item only if new version if available
      $(htmlList).append(appItem);
  }

  $(htmlList).on('click', 'li .versionavailable button.btndownload', (event) => {
      let $progress = $(event.target).parents('li').find('.progress');
      let $progressBar = $progress.find('.progress-bar');
      let appId = $(event.target).parents('li').attr('id').trim();
      let version = $(event.target).parents('li').find('.appversion').text().trim();
      $(event.target).prop("disabled",true);
      $progress.css('display', 'block');

      //TODO remove the static url to dynamic content
      let destinationfilePath = path.join(dowloadedAppPath, "blender-2.79-windows64.msi");
      DownloadManager.get("http://download.blender.org/release/Blender2.79/blender-2.79-windows64.msi", destinationfilePath, (status, error) => {
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
              $(event.target).removeClass('btndownload').addClass('btnexecute');
              $(event.target).prop("disabled",false);
          }
      });

      $(htmlList).on('click', 'li .versionavailable button.btnexecute', (event) => {
        //todo
        //spawn(path, args);
        console.log("click btnexecute");
      });

     console.log("onclick: " + appId);
  });
}).catch((e) => {/* On error do nothing */ console.log(e);});
