const ApplicationManager = require('../model/ApplicationManager'),
    DownloadManager = require('../model/DownloadManager'),
    _ = require('lodash'),
    dialog = require('electron').remote.dialog,
    config = require('config'),
    path = require('path'),
    spawn = require('child_process').spawn,
    os = require('os'),
    fs = require('fs');

let applicationList = [];

let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);

function getApplicationById(appId){
  if(applicationList){
    for(let i=0; i< applicationList.length; i++){
        let el = applicationList[i];
        if(!el || !el.Name) continue;
        if(el.appId === appId){
          return el;
        }
      }
    }
    return null;
}

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
      $(htmlList).append(appItem);

      //Show item only if new version if available
      ApplicationManager.getUpdateInformation(el.Name).then((updateInfo) => {
        if(updateInfo !== null && el.Version !== updateInfo.Version) {
          el.updateInfo = updateInfo;
          let $listItem = $(htmlList).find('li#'+el.appId);

          $listItem.find('.versionavailable span').text(updateInfo.Version);
          $listItem.find('.versionavailable button').addClass('btndownload');
          $listItem.addClass('list-group-item-info');
        }
      });
  }

  $(htmlList).on('click', 'li .versionavailable button.btndownload', (event) => {
      let $progress = $(event.target).parents('li').find('.progress');
      let $progressBar = $progress.find('.progress-bar');
      let appId = $(event.target).parents('li').attr('id').trim();
      let version = $(event.target).parents('li').find('.appversion').text().trim();
      let app = getApplicationById(appId);
      let platform = os.platform();
      let arch = os.arch();
      $(event.target).prop("disabled",true);

      if(!app || !app.updateInfo){
        $(event.target).removeClass('btndownload');
        $(event.target).prop("disabled",false);
        return;
      }

      app.downloadInfo = {
        url:app.updateInfo.getUrl(platform, arch),
        isFinish: false
      };

      if(!app.downloadInfo.url){
        $(event.target).removeClass('btndownload');
        $(event.target).prop("disabled",false);
        app.downloadInfo = null;
        console.log("Cannot find url for this update" + appId);
        return;
      }

      $progress.css('display', 'block');
      //TODO remove the static url to dynamic content
      app.downloadInfo.destinationfilePath = path.resolve(path.join(dowloadedAppPath, path.basename(app.downloadInfo.url)));
      DownloadManager.get(app.downloadInfo.url, app.downloadInfo.destinationfilePath, (status, error) => {
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
              app.downloadInfo.isFinish = true;
              DownloadManager.sendNotification('Software update',
                  `An new version of ${appId} has been successfully downloaded.`);
              $(event.target).removeClass('btndownload').addClass('btnexecute');
              $(event.target).prop("disabled",false);
          }
      });

      $(htmlList).on('click', 'li .versionavailable button.btnexecute', (event) => {
        let appId = $(event.target).parents('li').attr('id').trim();
        let app = getApplicationById(appId);
        $(event.target).prop("disabled",true);

        if(!app || !app.downloadInfo || !app.downloadInfo.isFinish || !fs.existsSync(app.downloadInfo.destinationfilePath)){
          $(event.target).removeClass('btnexecute');
          $(event.target).prop("disabled",false);
          return;
        }

        //https://stackoverflow.com/questions/35365332/run-msi-package-from-nodejs-app
        var child = spawn('cmd', ["/S", "/C", path.basename(app.downloadInfo.destinationfilePath)],{ // /S strips quotes and /C executes the runnable file (node way)
          detached: true, //see node docs to see what it does
          cwd: path.dirname(app.downloadInfo.destinationfilePath), //current working directory where the command line is going to be spawned and the file is also located
          env: process.env
          //1) uncomment following if you want to "redirect" standard output and error from the process to files
          //stdio: ['ignore', out, err]
        });
        child.on('error', function(err) {
            console.error(err);
          });
        child.on('exit', function(code) {
            //TODO
            console.log("installer exit" + code);
          });
          // THIS IS TAKEN FROM NODE JS DOCS
          // By default, the parent will wait for the detached child to exit.
          // To prevent the parent from waiting for a given child, use the child.unref() method,
          // and the parent's event loop will not include the child in its reference count.
          child.unref();
        console.log("click btnexecute");
      });
     console.log("onclick: " + appId);
  });
}).catch((e) => {/* On error do nothing */ console.log(e);});

$(() => {
  $("#logo").click((e) => {
    $("#logo").rotate({
       angle:0,
       animateTo:360,
       easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
           return c*(t/d)+b;
       }
    });
  });
});
