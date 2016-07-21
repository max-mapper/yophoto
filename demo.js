var Yophoto = require('./index.js')
var el = document.querySelector('.photos')

var images = []

var gallery = new Yophoto(function afterRender () {
  gallery._layout(el)
})

var tree = gallery.app.start({hash: true})
el.appendChild(tree)
