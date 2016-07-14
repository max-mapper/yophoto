/**
*
* Google Image Layout v0.0.1
* Description, by Anh Trinh.
* http://trinhtrunganh.com
*
* Free to use under the MIT License.
*
*/

var margin = 5

module.exports = align

function align (elem) {
  //get the data attribute
  
  var containerWidth = elem.clientWidth
  var maxHeight = parseInt(elem.getAttribute('data-max-height') || 120)

  var imgNodes = turnObjToArray(elem.querySelectorAll('img'))

  outerWhile: while (imgNodes.length > 0) {

    for (var i = 1; i <= imgNodes.length; i++) {
      var slice = imgNodes.slice(0, i)
      var h = _getHeight(slice, containerWidth, margin)

      if (h < maxHeight) {
        _setHeight(slice, h)
        imgNodes = imgNodes.slice(i)
        continue outerWhile
      }
    }

    _setHeight(slice, Math.min(maxHeight, h))
    break
  }
}

function turnObjToArray (obj) {
  return [].map.call(obj, function(element) {
    return element
  })
}

/**
 * Get the height that make all images fit the container
 *
 * width = w1 + w2 + w3 + ... = r1*h + r2*h + r3*h + ...
 * 
 * @param  {[type]} images the images to be calculated
 * @param  {[type]} width  the container witdth
 * @param  {[type]} margin the margin between each image 
 * 
 * @return {[type]}        the height
 */
function _getHeight (images, width, margin) {
  // width -= images.length * margin
  // width -= images.length

  var r = 0
  var img

  for (var i = 0; i < images.length; i++) {
    img = images[i]
    r += parseInt(img.getAttribute('data-width')) / parseInt(img.getAttribute('data-height'))
  }

  return width / r //have to round down because Firefox will automatically roundup value with number of decimals > 3
}

function _setHeight (images, height) {
  var img

  for (var i = 0; i < images.length; i++) {
    img = images[i]
    img.style.width = height * parseInt(img.getAttribute('data-width')) / parseInt(img.getAttribute('data-height')) + 'px'
    img.style.height = height + 'px'
    img.classList.add('layout-completed')
  }

}