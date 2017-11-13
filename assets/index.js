const ApplicationManager = require('../model/ApplicationManager');


let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);

ApplicationManager.get().then((appList) => {
  let htmlList = document.getElementById("applicationList");
  document.getElementById("loading").style.display = 'none';

  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      let li = document.createElement("li");
      li.id = el.Name.replace(/\s+/g, '_');

      let divName = document.createElement("div");
      divName.classList.add("appname");
      let text = document.createTextNode(el.Name);
      divName.appendChild(text);

      let divVersion = document.createElement("div");
      divVersion.classList.add("appversion");
      text = document.createTextNode(el.Version);
      divVersion.appendChild(text);

      let updateInfo = document.createElement("span");
      updateInfo.classList.add("versionavailable");
      divVersion.appendChild(updateInfo);

      li.appendChild(divName);
      li.appendChild(divVersion);
      htmlList.appendChild(li);
  }
}).catch((e) => {/* On error do nothing */ console.log(e.getMessage());});
