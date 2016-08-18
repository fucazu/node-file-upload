var io = require('socket.io').listen(3001)
var ss = require('socket.io-stream')
var path = require('path')
var fs = require('fs')
var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000)

io.on('connection', function (socket) {
  console.log('alguem conectou...')

  ss(socket).on('transferFile', function (stream, data) {
    console.log('recebendo arquivo...', data)
    var tmpPath = __dirname + '/uploaded/' + data.name
    stream.pipe(fs.createWriteStream(tmpPath))

    stream.on('error', function (err) {
      console.error('err: ', err)
    })

    stream.on('end', function () {
      stream.unpipe()
    })
  })
})
