var Component = videojs.getComponent('Component');

var TitleBar = videojs.extend(Component, {
  constructor: function(player, options) {
    Component.apply(this, arguments);
    if (options.text) {
      this.updateTextContent(options.text);
    }
    const menuBtn = videojs.dom.createEl('div', {
      className: 'vjs-menu-btn'
    });
    menuBtn.addEventListener('click', function() {
      const playlist = $('.vjs-playlist.vjs-playlist-vertical');
      const menuBtnEl = $('.vjs-menu-btn');
      const listWidth = playlist.width();
      if (listWidth) {
        playlist.width(0);
        menuBtnEl.css('right', 0);
      } else {
        playlist.width('20%');
        menuBtnEl.css('right', '20%');
      }
    });
    videojs.dom.appendContent(this.el(), menuBtn);
  },
 
  createEl: function() {
    return videojs.dom.createEl('div', {
      className: 'vjs-title-bar'
    });
  },

  updateTextContent: function(text) {
    if (typeof text !== 'string') {
      text = 'Text Unknown';
    }
    const title = videojs.dom.createEl('span', {
      className: 'vjs-title'
    });
    
    videojs.dom.appendContent(title, text);
    videojs.dom.emptyEl(this.el());
    videojs.dom.appendContent(this.el(), title);
  }
});
 
videojs.registerComponent('TitleBar', TitleBar);