var FullScreen = function(elem){
  this.elem = document.querySelector(elem);
}
// 全屏
FullScreen.prototype.in = function() {  
  if (this.elem.requestFullscreen) {
    this.elem.requestFullscreen();
  } else if (this.elem.webkitRequestFullscreen) {
    this.elem.webkitRequestFullscreen();
  } else if (this.elem.mozRequestFullScreen) {
    this.elem.mozRequestFullScreen();
  } else if (this.elem.msRequestFullscreen) {
    this.elem.msRequestFullscreen();
  }
}
// 退出全屏
FullScreen.prototype.out = function() {  
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}