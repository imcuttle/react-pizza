/**
 * @file habitat
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/11/7
 *
 */

import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import isCompClass from '@rcp/util.iscompclass'
import createRef from 'createref'
import dotGet from 'lodash.get'

const toArray = require('./toArray')
const querySelectorAll = require('./querySelectorAll')

/**
 * @public
 * @param dom {HTMLElement}
 * @return {VDomResult}
 */
function VDom(dom) {
  const data = {}
  return {
    get dom() {
      return dom
    },
    data(key, value) {
      Object.assign(data, { [key]: value })
    },
    get(key) {
      return !key ? data : data[key]
    },
    isEqual(dom) {
      return dom === this || dom === this.dom
    }
  }
}

/**
 * @typedef Renderer
 * @public
 * @param {HTMLElement | HTMLElement[] | NodeList | string} selector
 * @param {any} props
 * @return {Controller}
 */

/**
 * Modify a component to be controllable
 * @public
 * @param {React.ComponentType} Component
 * @return {Renderer}
 */
module.exports = Component => {
  function pizzaRender(selector, props = {}) {
    const domList = querySelectorAll(selector)
    const vDomList = []

    function renderToDom(dom, restProps) {
      const assignedProps = Object.assign({}, props, restProps)

      const ref = typeof React.createRef === 'function' ? React.createRef() : createRef()
      if (isCompClass(Component)) {
        assignedProps.ref = ref
      }
      const node = <Component {...assignedProps}>{assignedProps.children}</Component>
      // dom.data
      render(node, dom)
      return { node, ref }
    }

    domList.forEach(dom => {
      const { node, ref } = renderToDom(dom)
      const vDom = VDom(dom)
      vDom.data('node', node)
      vDom.data('ref', ref)

      vDomList.push(vDom)
    })

    return {
      get origin() {
        return Component
      },
      /**
       * @param dom
       * @return {number}
       */
      indexOf(dom) {
        return vDomList.findIndex(vdom => vdom.isEqual(dom))
      },
      get(indexOrDom) {
        if (typeof indexOrDom === 'undefined') {
          return vDomList
        }

        const index = typeof indexOrDom === 'number' ? indexOrDom : this.indexOf(indexOrDom)
        if (index >= 0) {
          return vDomList[index]
        }
      },
      setProps(props, indexOrDom) {
        toArray(this.get(indexOrDom)).forEach(vdom => {
          if (vdom.dom) {
            const { node, ref } = renderToDom(vdom.dom, props)
            vdom.data('node', node)
            vdom.data('ref', ref)
          }
        })
      },
      remove(indexOrDom) {
        if (typeof indexOrDom === 'undefined') {
          let i = 0
          let len = vDomList.length
          while (i < len) {
            this.remove(0)
            i++
          }
          return
        }

        const index = typeof indexOrDom === 'number' ? indexOrDom : this.indexOf(indexOrDom)
        if (index >= 0) {
          const vdom = vDomList[index]
          vDomList.splice(index, 1)
          if (vdom && vdom.dom) {
            unmountComponentAtNode(vdom.dom)
            // vdom.dom.innerHTML = ''
          }
        }
      },
      ref(indexOrDom) {
        const vdomList = this.get(indexOrDom)
        if (Array.isArray(vdomList)) {
          return vdomList.map(vdom => this.ref(vdom))
        }
        const vdom = vdomList
        return vdom && vdom.get('ref')
      },
      call(methodName, argvs, indexOrDom) {
        if (!Array.isArray(argvs)) {
          indexOrDom = argvs
          argvs = []
        }
        const vdomList = this.get(indexOrDom)
        if (Array.isArray(vdomList)) {
          return vdomList.map(vdom => this.call(methodName, argvs, vdom))
        }
        const vdom = vdomList
        if (vdom && vdom.get('ref') && vdom.get('ref').current) {
          const method = dotGet(vdom.get('ref').current, methodName)
          const refName = methodName.replace(/\..+?$/, '')
          const parent = methodName === refName ? vdom.get('ref').current : dotGet(vdom.get('ref').current, refName)
          if (typeof method === 'function') {
            return method.apply(parent, argvs)
          }
          return method
        }
      }
    }
  }

  pizzaRender.origin = Component

  return pizzaRender
}
