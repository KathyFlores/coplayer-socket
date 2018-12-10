(function() {
  $.get("/api/video", function(data, status, xhr) { 
    console.log(data);
    if (data.video_list && data.video_list.length) {
      let plist = data.video_list.map(item => {
        item.sources = [{
          src: item.url || '',
          type: 'video/mp4',
        }];
        item.poster = item.front || '';
        item.thumbnail = [{
          src: item.front || ''
        }];
        return item;
      });
      const options = {
        controls: true,
        autoplay: false,
        preload: 'metadata',
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        fill: true,
        controlBar: {
          volumePanel: {
            inline: false
          }
        },
        src: plist[0].url
      };
      const player = videojs('my-video', options);
      player.ready(function() {
        this.hotkeys({
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false
        });

        this.addClass('vjs-has-started');
        this.trigger('firstplay');
      });
      player.on('userinactive', function() {
        if (!player.paused()) {
          const playlist = $('.vjs-playlist.vjs-playlist-vertical');
          const menuBtnEl = $('.vjs-menu-btn');
          playlist.width(0);
          menuBtnEl.css('right', 0);
        }
      });

      const fullscreenButton = $('.vjs-fullscreen-control.vjs-control.vjs-button').clone();
      $('.vjs-fullscreen-control.vjs-control.vjs-button').replaceWith(fullscreenButton);
      fullscreenButton.on('click', function(){
        const isFs = player.isFullscreen();
        const videoWrap = new FullScreen(".video-wrap");
        if (isFs) {
          videoWrap.out();
        } else {
          videoWrap.in();
        }
        player.isFullscreen(!isFs);
      });
      player.playlist(plist);
      player.playlistUi();
      Coplayer(player);
      let name = $('.vjs-playlist-item .vjs-playlist-now-playing .vjs-playlist-name').attr('title');
      player.addChild('TitleBar', {text: name});
      $('.vjs-playlist-item').click(function() {
        name = $(this).find('.vjs-playlist-name').attr('title');
        $('.vjs-title').html(name);
      });
    }
    else {
      alert('获取视频列表失败！');
    }
  }).fail(function() {
    alert('获取视频列表失败！请检查是否登陆');
  });
})();