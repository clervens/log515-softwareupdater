const ApplicationManager = require('../model/ApplicationManager'),
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

$(htmlList).on('click', 'li .versionavailable button', (event) => {
    let $progress = $(event.target).parents('li').find('.progress');
    let $progressBar = $progress.find('.progress-bar');
    let appId = $(event.target).parents('li').attr('id').trim();
    let version = $(event.target).parents('li').find('.appversion').text().trim();
    $progress.css('display', 'block');

    let percent = 0;
    let intervalId = setInterval(() => {
        percent += Math.random()*30;
        percent = Math.min(percent, 100);
        $progressBar.css('width', `${percent}%`);

        if (percent >= 100) {
            clearInterval(intervalId);
            $progress.fadeOut('slow',null,() => {
                $progressBar.css('width', `0%`);
            });

            // Switch icon to save update to dir to install.
            /*dialog.showSaveDialog(null, {
                title: 'test',
                defaultPath: `${appId} - ${version}.zip`
            },(filename) => {

            });*/

            ApplicationManager.sendNotification('Software update',
                `An new version of ${appId} has been successfully downloaded.`);
        }
    }, 500);

   console.log("onclick: " + appId);
});

  let appListTemplate = _.template(document.querySelector('#AppListTemplate').textContent);
  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      if(!el || !el.Name) continue;
      
      let appItem = appListTemplate({
          appId: el.Name.replace(/\s+/g, '_'),
          Name: el.Name,
          Version: el.Version
      });

      $(htmlList).append(appItem);
  }
}).catch((e) => {/* On error do nothing */ console.log(e);});
