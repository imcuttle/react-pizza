/**
 * @file toArray
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/11/7
 *
 */

function toArray(item) {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}

module.exports = toArray
