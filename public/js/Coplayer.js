
function Coplayer(inPlayer) {
  if (window !== top) {
    return;
  }
  let id = 'we-coplayer';
  if (get(id)) {
    return;
  }
  /**
   * Common utilis
   */
  function getId(part) {
    return id + '-' + part;
  }

  function get(id) {
    return top.document.getElementById(id);
  }

  function create(tagName, parent, props) {
    let elem = document.createElement(tagName);
    for (let prop in props) {
      elem[prop] = props[prop];
    }
    if (parent) {
      parent.appendChild(elem);
    }
    return elem;
  }

  function remove(ele) {
    ele.parentNode.removeChild(ele);
  }

  function on(elem, type, listener, noStop) {
    let prefixes = ['', 'webkit', 'moz'];
    let prefix = prefixes.find(prefix => elem['on' + prefix + type] !== undefined);
    elem.addEventListener(prefix + type, function (e) {
      listener.call(elem, e);
      if (!noStop) {
          e.preventDefault();
          e.stopPropagation();
      }
      return !!noStop;
    }, false);
  }

  var player = inPlayer;
 
  var socket = io();
  
  function initUi() {
    socket.on('connect', () => {
      if (get(id)) {
        remove(get(id));
      }
      var localId = socket.id;
      socket.emit('online', {
        id: localId
      });
      let main = create('article', document.body, {
        id: id,
        className: 'article-main'
      });
      let local = create('input', main, {
        id: getId('local'),
        type: 'text',
        value: localId,
        readOnly: true
      });
      on(local, 'click', () => {});
      let remote = create('input', main, {
        id: getId('remote'),
        type: 'text',
        placeholder: "输入对方ID"
      });
      on(remote, 'click', () => {});
      let syncBtn = create('button', main, {
        id: getId('sync-btn'),
        innerHTML: 'sync'
      });
      
      on(syncBtn, 'click', () => {
        let data = {
          local: localId,
          remote: remote.value,
          current: player.currentTime()
        };
        socket.emit('sync', data);
        
      });
      socket.on('sync', function(data){
        console.log(data);
        if (data.errorMsg) {
          alert(data.errorMsg);
          return;
        } else if (data.remote == localId || data.local == localId) {
          player.currentTime(data.current);
        }
      });
      let playButton = create('button', main, {
        id: getId('play-btn'),
        innerHTML: 'play'
      });
      on(playButton, 'click', () => {
        let data = {
          local: localId,
          remote: remote.value
        };
        socket.emit('play', data);
      });
      socket.on('play', function(data){
        console.log(data);
        if (data.errorMsg) {
          alert(data.errorMsg);
          return;
        } else if (data.remote == localId || data.local == localId) {
          player.play();
        }
      });
    });
    
    
    
  }
  initUi();
};
