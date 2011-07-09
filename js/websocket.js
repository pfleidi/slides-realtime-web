(function connect($, window, undefined) {
    var socket = new io.Socket(window.location.hostname, { port: window.location.port });
    socket.connect();

    function log(msg) {
      try {
        console.log(msg);
      } catch (e) { }
    }

    function getSlideNumber() {
      return window.location.hash ? parseInt(window.location.hash.split('#slide')[1], 10) : 1;
    }

    function switchToSlide(payload) {
      if (payload.action === 'move') {
        window.history.go(- getSlideNumber() + payload.data);
      } else {
        log('unknown slide action: ' + payload.action);
      }
    }

    function evalChat(payload) {
      if (payload.action === 'msg') {
        $('#chatfield').append(payload.data + '<br/>');
        var chatfield = $('#chatfield');
        chatfield.scrollTop(chatfield[0].scrollHeight);
      } else {
        log('unknown chat action');
      }   
    }   

    function sendText() {
      var text = $('#chatInput').val();

      if (text === '') {
        return;
      }
      socket.send(JSON.stringify({ type: 'chat', payload: { action: "msg", data: text} }));
      $('#chatInput').val('');
    }

    socket.on('message', function (data) {
        try {
          var msg = JSON.parse(data);
          switch (msg.type) {
          case 'chat': 
            evalChat(msg.payload);
            break;
          case 'slide':
            switchToSlide(msg.payload);
            break;
          default:
            log('unknown type ' + msg.type);
          }
        } catch (err) {
          log('Error while parsing data:' + err);
        }

      });

    socket.on('disconnect', function () {
        log('Connection closed');
      });

    $('#chatbutton').click(sendText);

    $('#chatInput').keydown(function (e) {
        if (/^(input|textarea)$/i.test(e.target.nodeName) || e.target.isContentEditable) {
          if (e.keyCode === 13) {
            sendText();
          }
          return;
        }
      });

    window.addEventListener('popstate', function (event) {
        if (event.state) {
          socket.send(JSON.stringify({ type: 'slide', payload: { action: 'move', data: event.state} }));
        }
      }, true);

    window.authenticate = function (user, password) {
      socket.send(JSON.stringify({
            type: 'slide',
            payload: {
              action: 'authenticate',
              data: {
                user: user,
                password: password
              }
            }
          }));
    };

  }(jQuery, window));
