var choo = require('choo')
var html = require('choo/html')
var imagesLoaded = require('imagesloaded')
var googleImageLayout = require('./google-image-layout.js')
var CreateControls = require('./create-controls.js')
var debounce = require('./debounce.js')

module.exports = Gallery

function Gallery (images, afterRender) {
  if (!(this instanceof Gallery)) return new Gallery(images, afterRender)
  var self = this
  this.afterRender = afterRender
  this.app = choo()

  this.app.model({
    namespace: 'gallery',
    state: {
      images: images
    },
    reducers: {
      increment: (action, state) => ({count: state.count + 1})
    }
  })

  this.app.router(function (route) {
    return [
      route('/', self.galleryView.bind(self))
    ]
  })
  
  // this._element = element
  // this._images = this._element.querySelectorAll('div[data-images]')
  // this._layout()
}

/**
 * Css class names stored as strings.
 *
 * @private
 */

Gallery.prototype._cssClasses = {
  GALLERY: 'm-p-g',
  THUMBS_BOX: 'm-p-g__thumbs',
  THUMB_IMG: 'm-p-g__thumbs-img',
  FULL_BOX: 'm-p-g__fullscreen',
  FULL_IMG: 'm-p-g__fullscreen-img',
  CONTROLS: 'm-p-g__controls',
  CONTROLS_CLOSE: 'm-p-g__controls-close',
  CONTROLS_NEXT: 'm-p-g__controls-arrow--next',
  CONTROLS_PREV: 'm-p-g__controls-arrow--prev'
}

/**
 * Init the Google Image Layout.
 */

Gallery.prototype._layout = function (el) {
  var images = el.querySelectorAll('img')
  var thumbs = el.querySelector('.' + this._cssClasses.THUMBS_BOX)
  console.log(thumbs, el)
  var imgLoad = imagesLoaded(images)

  imgLoad.on('progress', function (instance, image) {
    image.img.setAttribute('data-width', image.img.offsetWidth)
    image.img.setAttribute('data-height', image.img.offsetHeight)
  })

  imgLoad.on('done', function (instance) {
    googleImageLayout(thumbs)
    // gallery.init()
    // gallery._loadFullImgs()
  })

  imgLoad.on('fail', function (instance) {
    return console.error('fail')
    var galleryEl = gallery._element
    var alertBox = document.createElement('div')
    alertBox.className = 'm-p-g__alertBox'
    var alertBoxTitle = document.createElement('h2')
    alertBoxTitle.innerHTML = 'Error'
    var alertBoxMessage = document.createElement('p')
    alertBox.appendChild(alertBoxTitle)
    alertBox.appendChild(alertBoxMessage)
    galleryEl.appendChild(alertBox)

    var brokenImages = []
    instance.images.forEach(function (image) {
      if (!image.isLoaded) {
        brokenImages.push(image.img.currentSrc)
      }
    })

    alertBoxMessage.innerHTML = 'Failed to load:' + ' ' + brokenImages
  })

  // window.onresize = debounce(function () {
  //   googleImageLayout(gallery._images)
  //   setTimeout(function () {
  //     gallery._handleResize()
  //   }, 500)
  // }, 25)
}

/**
 * Init the Gallery component.
 */

Gallery.prototype.galleryView = function (state, prev, send) {
  var self = this
  // var controls = CreateControls.init()
  // this._element.appendChild(controls)
  var el = html`
		<div class="m-p-g">
      <div class="m-p-g__thumbs" data-images data-max-height="350">
        ${state.gallery.images.map(function (img) {
          return html`
            <img src="${img.thumb}" data-full="${img.full}" class="m-p-g__thumbs-img" />
          `
        })}
      </div>
      <div class="m-p-g__fullscreen"></div>
    </div>
  `
  setTimeout(function () {
    self.afterRender()
  }, 0)
  return el
  // Container element for thumbnails.
  // this._thumbsBox = this._gallery.querySelector('.' + this._cssClasses.THUMBS_BOX)

  // Container of full size images.
  // this._fullBox = this._gallery.querySelector('.' + this._cssClasses.FULL_BOX)

  // // Container of controls.
  // this._controls = this._gallery.querySelector('.' + this._cssClasses.CONTROLS)
  //
  // // Close control button.
  // this._closeBtn = this._controls.querySelector('.' + this._cssClasses.CONTROLS_CLOSE)
  //
  // // Prev control button.
  // this._prevBtn = this._controls.querySelector('.' + this._cssClasses.CONTROLS_PREV)
  //
  // // Next control button.
  // this._nextBtn = this._controls.querySelector('.' + this._cssClasses.CONTROLS_NEXT)

  // Is true when the full size images have been loaded.
  // this._fullImgsLoaded = false

  // Is true when a full size image is being viewed.
  // this._fullImgOpen = false

  // Bind events to elements.
  // this._bindEvents()
}

/**
 * Add event listeners to elements.
 *
 * @private
 */

Gallery.prototype._bindEvents = function () {
  for (var i = 0, ii = this._thumbs.length; i < ii; i++) {
    // Add click event to each thumbnail.
    this._thumbs[i].addEventListener('click', this._handleThumbClick.bind(this))

    // Add hover event to each thumbnail.
    this._thumbs[i].addEventListener('mouseover', this._handleThumbHover.bind(this))
  }

  // Add click event to close button.
  this._closeBtn.addEventListener('click', this._handleClose.bind(this))

  // Add click event to next button.
  this._nextBtn.addEventListener('click', this._handleNext.bind(this))

  // Add click event to prev button.
  this._prevBtn.addEventListener('click', this._handlePrev.bind(this))

  window.addEventListener('scroll', this._handleScroll.bind(this))
}

Gallery.prototype._handleScroll = debounce(function () {
  if (this._fullImgsLoaded) this._resetFullImg()
}, 25)

Gallery.prototype._handleResize = function () {
  if (this._fullImgsLoaded) this._resetFullImg()
}

/**
 * Load the full size images from the 'data-full' attribute.
 *
 * @private
 */

Gallery.prototype._loadFullImgs = function () {
  var src
  var img

  for (var i = 0, ii = this._thumbs.length; i < ii; i++) {
    // Source of full size image.
    src = this._thumbs[i].getAttribute('data-full')

    // Create empty Image object.
    img = new window.Image()

    // Give new Image full size image src value.
    img.src = src

    // Give new Image appropriate class name.
    img.classList.add(this._cssClasses.FULL_IMG)

    // Append full size image to full size image container.
    this._fullBox.appendChild(img)
  }

  this._loadFullImgsDone()
}

Gallery.prototype._loadFullImgsDone = function () {
  var imgLoad = imagesLoaded(this._fullBox)

  imgLoad.on('always', function (instance) {
    var imgArr = instance.images

    imgArr.forEach(function (img) {
      if (!img.isLoaded) console.error(img.img.src + ' ' + 'failed to load.')
    })

    this._fullImgs = []
    this._fullImgDimensions = []
    this._fullImgsTransforms = []

    for (var i = 0, ii = imgArr.length; i < ii; i++) {
      var rect = imgArr[i].img.getBoundingClientRect()
      this._fullImgs.push(imgArr[i].img)
      this._positionFullImgs(imgArr[i].img, i)
      this._fullImgDimensions.push(rect)
    }

    this._fullImgsLoaded = true
  }.bind(this))
}

Gallery.prototype._positionFullImgs = function (img, i, applyTransform) {
  var transform = this._transformFullImg(img, this._thumbs[i])
  this._fullImgsTransforms.push(transform)

  img.style.marginTop = -img.height / 2 + 'px'
  img.style.marginLeft = -img.width / 2 + 'px'
  if (applyTransform !== false) {
    img.style['transform'] = transform
  }
}

/**
 * Makes the thumbnail transform to the same size and position as the full
 * size image.
 *
 * @private
 */

Gallery.prototype._transformFullImg = function (fullImg, thumb, fullImgSize) {
  var scaleX, scaleY, transX, transY

  fullImg = fullImg.getBoundingClientRect()
  thumb = thumb.getBoundingClientRect()

  if (fullImgSize) {
    scaleX = (thumb.width / fullImgSize.width).toFixed(3)
    scaleY = (thumb.height / fullImgSize.height).toFixed(3)
    transX = thumb.left - fullImgSize.left + (fullImgSize.width / 2)
    transY = thumb.top - fullImgSize.top + (fullImgSize.height / 2)
  } else {
    scaleX = (thumb.width / fullImg.width).toFixed(3)
    scaleY = (thumb.height / fullImg.height).toFixed(3)
    transX = thumb.left - fullImg.left + (fullImg.width / 2)
    transY = thumb.top - fullImg.top + (fullImg.height / 2)
  }

  var transform = 'translate(' + transX + 'px,' + transY + 'px) scale(' + scaleX + ',' + scaleY + ')'

  return transform
}

Gallery.prototype._resetFullImg = function () {
  this._fullImgsTransforms = []

  for (var i = 0, ii = this._fullImgs.length; i < ii; i++) {
    if (i === this._thumbIndex && this._fullImgOpen) {
      this._fullImgs[i].removeAttribute('style')
      this._positionFullImgs(this._fullImgs[i], i, false)
    } else {
      this._fullImgs[i].removeAttribute('style')
      this._positionFullImgs(this._fullImgs[i], i)
    }
  }
}

/**
 * Thumbnail hover event.
 *
 * @param {Event} event - The event.
 * @private
 */

Gallery.prototype._handleThumbHover = function (event) {
  if (this._fullImgsLoaded && !this._fullImgOpen) {
    this._transformThumbSetup(event)
  }
}

/**
 * Thumbnail click event.
 *
 * @param {Event} event - The event.
 * @private
 */

Gallery.prototype._handleThumbClick = function (event) {
  if (this._thumb !== event.target) {
    // Cache the thumb being hovered over.
    this._thumb = event.target

    // Index of thumb.
    this._thumbIndex = this._thumbs.indexOf(this._thumb)

    // The full size image of that thumbnail.
    this._fullImg = this._fullImgs[this._thumbIndex]
  }

  if (this._setupComplete && this._fullImgsLoaded && !this._fullImgOpen) {
    this._activateFullImg()
    this._activateControls()
    this._activateFullBox()
    this._disableScroll()
  }
}

/**
 * Caches the thumbnail and full size image that was just hovered over.
 * Stores the css transform value so we can use it later.
 *
 * @param {Event} event - The event.
 * @param {Function} fn - An optional callback function.
 * @private
 */

Gallery.prototype._transformThumbSetup = function (event, fn) {
  this._setupComplete = false

  // Cache the thumb being hovered over.
  this._thumb = event.target

  // Index of thumb.
  this._thumbIndex = this._thumbs.indexOf(this._thumb)

  // The full size image of that thumbnail.
  this._fullImg = this._fullImgs[this._thumbIndex]

  this._setupComplete = true

  if (fn) fn()
}

Gallery.prototype._activateFullImg = function () {
  this._thumb.classList.add('hide')
  this._fullImg.classList.add('active')
  this._fullImg.style['transform'] = 'translate3d(0,0,0)'
  this._fullImgOpen = true

  this._fullImgs.forEach(function (img) {
    if (!img.classList.contains('active')) {
      img.classList.add('almost-active')
    }
  })
}

/**
 * Show the fullBox.
 *
 * @private
 */

Gallery.prototype._activateFullBox = function () {
  this._fullBox.classList.add('active')
}

/**
 * Show the controls.
 *
 * @private
 */

Gallery.prototype._activateControls = function () {
  this._controls.classList.add('active')
}

/**
 * CloseBtn click event.
 *
 * @private
 */

Gallery.prototype._handleClose = function () {
  if (this._fullImgOpen) this._closeFullImg()
}

Gallery.prototype._closeFullImg = function () {
  var animation = function () {
    this._fullBox.classList.remove('active')
    this._controls.classList.remove('active')
    this._fullImg.style['transform'] = this._fullImgsTransforms[this._thumbIndex]
    this._thumb.classList.remove('hide')

    this._fullImgs.forEach(function (img) {
      img.classList.remove('almost-active')
    })

    var fullImgTransEnd = function () {
      this._fullImg.classList.remove('active')
      this._fullImg.removeEventListener('transitionend', fullImgTransEnd)
      this._fullImgOpen = false
    }.bind(this)

    this._fullImg.addEventListener('transitionend', fullImgTransEnd)
    this._enableScroll()
  }.bind(this)
  window.requestAnimationFrame(animation)
}

/**
 * NextBtn click event.
 *
 * @private
 */

Gallery.prototype._handleNext = function () {
  if (this._fullImgOpen) {
    this._changeImg('next')
  }
}

/**
 * PrevBtn click event.
 *
 * @private
 */

Gallery.prototype._handlePrev = function () {
  if (this._fullImgOpen) {
    this._changeImg('prev')
  }
}

/**
 * Changes the active full size image and active thumbnail based on which
 * arrow was click (prev || next).
 *
 * @param {String} dir - A string to determine if we're going Prev or Next.
 * @private
 */

Gallery.prototype._changeImg = function (dir) {
  this._thumbIndex = this._fullImgs.indexOf(this._fullImg)
  dir === 'next' ? this._thumbIndex += 1 : this._thumbIndex -= 1

  this._newFullImg = dir === 'next' ? this._fullImg.nextElementSibling : this._fullImg.previousElementSibling

  if (!this._newFullImg || this._newFullImg.nodeName !== 'IMG') {
    this._newFullImg = dir === 'next' ? this._newFullImg = this._fullImgs[0] : this._newFullImg = this._fullImgs[this._fullImgs.length - 1]
    dir === 'next' ? this._thumbIndex = 0 : this._thumbIndex = this._fullImgs.length - 1
  }

  this._newFullImg.style['transform'] = 'translate3d(0,0,0)'
  this._fullImg.classList.remove('active')
  this._fullImg.style['transform'] = this._fullImgsTransforms[this._thumbIndex - 1]

  this._fullImg = this._newFullImg
  this._fullImg.classList.add('active')
}

/**
 * Disables scrolling. Activated when a full size image is open.
 *
 * @private
 */

Gallery.prototype._disableScroll = function () {
  function preventDefault (e) {
    e = e || window.event
    if (e.preventDefault) e.preventDefault()
    e.returnValue = false
  }

  window.onwheel = preventDefault
  window.ontouchmove = preventDefault
}

/**
 * Enables scrolling. Activated when a full size image is closed.
 *
 * @private
 */

Gallery.prototype._enableScroll = function () {
  window.onwheel = null
  window.ontouchmove = null
}
