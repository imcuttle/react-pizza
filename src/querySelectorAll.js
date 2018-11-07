/**
 * @file querySelectorAll
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/11/7
 *
 */
const toArray = require('./toArray')

function assetSelector(selector) {
  if (Array.isArray(selector)) {
    selector.forEach((selector, i) => {
      try {
        assetSelector(selector)
      } catch (e) {
        throw new Error(`Error occurs in selector[${i}]: ${e.message}`)
      }
    })
  }

  if (!(selector instanceof NodeList) && !(selector instanceof HTMLElement) && typeof selector !== 'string') {
    throw new Error(`Expect instance of NodeList, HTMLElement or string, but ${selector}`)
  }
}

function querySelectorAll(selector) {
  assetSelector(selector)
  if (typeof selector === 'string') {
    selector = document.querySelectorAll(selector)
  }
  if (selector instanceof NodeList) {
    selector = [].slice.apply(selector)
  }
  return toArray(selector)
}

module.exports = querySelectorAll
