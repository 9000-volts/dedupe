var fileOpened = false;
var ipc = require ("ipc");
var message = function (msg) {
  document.querySelector(".message").innerHTML = msg;
};
message ("Welcome.<br/>Type Ctrl + O to choose folders to dedupe files from.");
window.onkeydown = function (e) {
  if (e.ctrlKey) {
    if (e.keyCode == 79 && !fileOpened)
      ipc.send("open");
    else if (e.keyCode == 72)
      ipc.send("information");
  }
};
var processing = function () {
  message ("Deduping your images.<br/>Please Wait. This could take a long time.");
  fileOpened = true;
};
var done = function () {
  message ("Done!<br/>Press Ctrl + O again to dedupe more folders.");
  fileOpened = false;
};
