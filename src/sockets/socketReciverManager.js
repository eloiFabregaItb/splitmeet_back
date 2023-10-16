export default function socketRecieverManager(socket){
  console.log('a user connected')

  socket.on('chatMsg', async (msg) => {
    console.log(msg)
    socket.emit('chatMsg', msg.repeat(7));
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}