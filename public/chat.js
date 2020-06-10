

  var socket = io();
  socket.on('connected',(data)=>{
    console.log('connected:', data);
  })
  socket.on('message', function (data) {
    console.log('message',data);
    var client_id = data.client_id == socket.id ? "Me": data.client_id;

    $('#messages').append(`<li>[${client_id}] : ${data['msg']}</li>`);
  });
  let grabAndEmitMessage= ()=>{
    let data = {}
    //data.user = $(this).closest("form").attr("user")
    data.msg = $('#m').val();
    //data.client_id = 
    if(data.msg !== ''){
    socket.emit('message', JSON.stringify(data));
    $('#m').val('');
    }
  }
  $('#m').keydown(function (e) {
    if (e.keyCode == 13) {
      //console.log(e.keyCode, $(this).val())
      e.preventDefault();
      grabAndEmitMessage();
    }
    else {
      $('#typing').html('<i>typing</i>')
    }
  });
  $('#m').keyup((e) => {
    $('#typing').html('')
  });
  $('#send').on('click',(e)=>{
    e.preventDefault();
    grabAndEmitMessage();
  })
  $.ajax({
    method: 'GET',
    url: '/user',
    success: function(s) {
      console.log(s.users)
      for (let u in s.users) {

      }
    },
    error: function(e) {
      console.error(e)
    }
  })
