const ApplicationManager = require('../model/ApplicationManager'),
    _ = require('lodash');
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
    $progress.css('display', 'block');

    // Change for loop until completed.
    $progressBar.css('width', '90%');

    let appId = $(event.target).parents('li').attr('id');

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
