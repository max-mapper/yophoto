var Yophoto = require('./index.js')
var el = document.querySelector('.photos')

var images = [
  {thumb: "http://unsplash.it/600/400?image=940", "full": "http://unsplash.it/1200/800?image=940"},
  {thumb: "http://unsplash.it/640/450?image=906", "full": "http://unsplash.it/1280/900?image=906"},
  {thumb: "http://unsplash.it/550/420?image=885", "full": "http://unsplash.it/1100/840?image=885"},
  {thumb: "http://unsplash.it/650/450?image=823", "full": "http://unsplash.it/1300/900?image=823"},
  {thumb: "http://unsplash.it/600/350?image=815", "full": "http://unsplash.it/1200/700?image=815"},
  {thumb: "http://unsplash.it/560/500?image=677", "full": "http://unsplash.it/1120/1000?image=677"},
  {thumb: "http://unsplash.it/670/410?image=401", "full": "http://unsplash.it/1340/820?image=401"},
  {thumb: "http://unsplash.it/620/340?image=623", "full": "http://unsplash.it/1240/680?image=623"},
  {thumb: "http://unsplash.it/790/390?image=339", "full": "http://unsplash.it/1580/780?image=339"}
]

var gallery = new Yophoto(images, function afterRender () {
  gallery._layout(el)
})

var tree = gallery.app.start()
el.appendChild(tree)
