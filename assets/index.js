const ApplicationManager = require('../model/ApplicationManager');
let applicationList = [];

let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);

ApplicationManager.get().then((appList) => {
  if(appList === null)
      appList = [];
  applicationList = appList;
  let htmlList = document.getElementById("applicationList");
  document.getElementById("loading").style.display = 'none';

  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      if(!el || !el.Name) continue;
      let li = document.createElement("li");
      el.appId = el.Name.replace(/\s+/g, '_');
      li.id = el.appId;

      let divName = document.createElement("div");
      divName.classList.add("appname");
      let text = document.createTextNode(el.Name);
      divName.appendChild(text);

      let divVersion = document.createElement("div");
      divVersion.classList.add("appversion");
      text = document.createTextNode(el.Version);
      divVersion.appendChild(text);

      let progress = document.createElement("div");
      progress.classList.add("progress");
      progress.style.display = 'none';

      let progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-valuenow", "0");
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", "100");
      progressBar.style.width = 0;

      progress.appendChild(progressBar);

      let updateInfo = document.createElement("span");
      updateInfo.classList.add("versionavailable");
      divVersion.appendChild(updateInfo);

      let btn = document.createElement("button");
      btn.onclick = function() {
         progress.style.display = 'block';
         //example
        progressBar.style.width = '90%';
        console.log("onclick:" + el.appId);
      };
      updateInfo.appendChild(btn);

      li.appendChild(divName);
      li.appendChild(divVersion);
      li.appendChild(progress);
      htmlList.appendChild(li);
  }
}).catch((e) => {/* On error do nothing */ console.log(e);});
