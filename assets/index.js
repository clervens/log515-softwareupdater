const ApplicationManager = require('../model/ApplicationManager');
ApplicationManager.get().then((appList) => {
  let htmlList = document.getElementById("applicationList");

  for(let i=0; i< appList.length; i++){
      let el = appList[i];
      let li = document.createElement("li");
      let text = document.createTextNode(el.Name + " " + el.Version);
      li.appendChild(text);
      htmlList.appendChild(li);
  }
}).catch((e) => {/* On error do nothing */});

let body = document.getElementsByTagName('body')[0];
body.classList.add(process.platform);