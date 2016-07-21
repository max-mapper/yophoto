var encoding = require('dat-encoding')
var swarm = require('hyperdrive-archive-swarm')

module.exports = getDat

function getDat (key, drive, cb) {
  if (key) {
    getArchive(key, cb)
  } else {
    throw new Error('no key ya dingus')
  }
  
  function getArchive (key, cb) {
    // if ((typeof key) === 'string') key = encoding.decode(key)
    // if (Buffer.isBuffer(key)) key = key.toString('hex')
    console.log('createArchive', [key])
    var archive = drive.createArchive(key, {live: true, sparse: true})
    var sw = swarm(archive)
    sw.on('connection', function (peer) {
      // store.dispatch({ type: 'UPDATE_PEERS', peers: sw.connections })
      // peer.on('close', function () {
      //   store.dispatch({ type: 'UPDATE_PEERS', peers: sw.connections })
      // })
    })
    archive.open(function () {
      if (archive.content) {
        archive.content.get(0, function (data) {
          // XXX: Hack to fetch a small bit of data so size properly updates
        })
      }
      cb(archive)
    })

    // archive.on('download', function () {
    //   store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
    // })
    // archive.on('upload', function () {
    //   store.dispatch({type: 'UPDATE_ARCHIVE', archive: archive})
    // })
  }
  
}