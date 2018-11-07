/**
 * @file habitat
 * @author Cuttle Cong
 * @date 2018/11/7
 * @description
 */
const habitat = require('../src')
const React = require('react')
const ReactDOM = require('react-dom')

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })

describe('pizza', function() {
  const runTest = () => {
    it('spec case', () => {
      document.body.innerHTML = `<div id="root"></div>`
      habitat(({ title }) => <div>{title}</div>)('#root')

      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><div></div></div>"`)
    })

    it('props case', () => {
      document.body.innerHTML = `<div id="root"></div>`
      habitat(({ title }) => <div>{title}</div>)('#root', { title: 'lala' })

      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><div>lala</div></div>"`)
    })

    it('props in multi case', () => {
      document.body.innerHTML = `<div class="g"></div><span class="g"></span>`
      habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })

      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"><div>lala</div></div><span class=\\"g\\"><div>lala</div></span>"`
      )
    })

    it('setProps case', () => {
      document.body.innerHTML = `<div id="root"></div>`
      const c = habitat(({ title }) => <div>{title}</div>)('#root', { title: 'lala' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><div>lala</div></div>"`)

      c.setProps({ title: 'uuu' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><div>uuu</div></div>"`)
    })

    it('setProps in multi case', () => {
      document.body.innerHTML = `<div class="g"></div><span class="g"></span>`
      const c = habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"><div>lala</div></div><span class=\\"g\\"><div>lala</div></span>"`
      )

      c.setProps({ title: 'uuu' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"><div>uuu</div></div><span class=\\"g\\"><div>uuu</div></span>"`
      )
    })

    it('re render in multi case', () => {
      document.body.innerHTML = `<div class="g"></div><span class="g"></span>`
      const c = habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"><div>lala</div></div><span class=\\"g\\"><div>lala</div></span>"`
      )

      habitat(({ title }) => <div>{title}</div>)('.g', { title: 'uuu' })
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"><div>uuu</div></div><span class=\\"g\\"><div>uuu</div></span>"`
      )
    })

    it('`get` in multi case', () => {
      document.body.innerHTML = `<div class="g"></div><span class="g"></span>`
      const c = habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })

      // Returns All
      expect(c.get().map(x => x.dom)).toMatchInlineSnapshot(`
Array [
  <div
    class="g"
  >
    <div>
      lala
    </div>
  </div>,
  <span
    class="g"
  >
    <div>
      lala
    </div>
  </span>,
]
`)
      // Returns by index
      expect(c.get(0)).toBe(c.get()[0])

      // Returns by index
      expect(c.get(document.querySelector('span.g'))).toBe(c.get(1))
    })

    it('`remove` in multi case', () => {
      document.body.innerHTML = `<div class="g"></div><span class="g"></span>`
      const c = habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })

      // Remove by index
      expect(c.get().length).toBe(2)
      c.remove(0)
      // not work
      c.remove(1)
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"></div><span class=\\"g\\"><div>lala</div></span>"`
      )
      expect(c.get().length).toBe(1)

      // Remove by dom
      // not work
      c.remove(document.querySelector('div'))
      expect(document.body.innerHTML).toMatchInlineSnapshot(
        `"<div class=\\"g\\"></div><span class=\\"g\\"><div>lala</div></span>"`
      )
      c.remove(document.querySelector('span'))
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div class=\\"g\\"></div><span class=\\"g\\"></span>"`)
      expect(c.get().length).toBe(0)

      const d = habitat(({ title }) => <div>{title}</div>)('.g', { title: 'lala' })
      expect(d.get().length).toBe(2)
      d.remove()
      expect(d.get().length).toBe(0)
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div class=\\"g\\"></div><span class=\\"g\\"></span>"`)
    })

    class Timer extends React.Component {
      state = {
        count: this.props.count || 1
      }

      fn = {
        val: 'abc',
        ok(val) {
          this.val = val
        },
        setOk: val => {
          this.val = val
        }
      }

      componentDidMount() {
        this._t = setInterval(() => {
          this.increase()
        }, 1000)
      }

      componentWillUnmount() {
        clearInterval(this._t)
        delete this._t
      }

      increase() {
        this.setState({ count: this.state.count + 1 })
      }

      render() {
        return <p>{this.state.count}</p>
      }
    }

    it('origin', () => {
      const render = habitat(Timer)
      const timer = render('#root', { count: 10 })
      expect(timer.origin).toBe(Timer)
      expect(render.origin).toBe(Timer)
    })

    it('`call` in deep', async () => {
      const render = habitat(Timer)
      document.body.innerHTML = `<div id="root"></div>`
      const timer = render('#root', { count: 10 })

      expect(timer.call('fn.val', 0)).toBe('abc')
      timer.call('fn.ok', ['hhh'])
      expect(timer.call('fn.val', 0)).toBe('hhh')
      expect(timer.call('val', 0)).toBeUndefined()

      timer.call('fn.setOk', ['hhhhh'])
      expect(timer.call('val', 0)).toBe('hhhhh')
    })

    it('ReactComponent case', async () => {
      jest.useFakeTimers()

      document.body.innerHTML = `<div id="root"></div>`
      const timer = habitat(Timer)('#root', { count: 10 })
      jest.advanceTimersByTime(3000)
      jest.useRealTimers()

      await delay()
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><p>13</p></div>"`)

      const { ref } = timer.get(0).get()
      const firstTimerRef = timer.ref(0)
      expect(firstTimerRef).toBe(ref)
      expect(timer.ref()[0]).toBe(ref)
      ref.current.increase()
      await delay()
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><p>14</p></div>"`)

      // call
      timer.call('increase')
      await delay()
      expect(timer.call('state.count')).toEqual([15])
      expect(timer.call('state')).toEqual([{ count: 15 }])
      expect(document.body.innerHTML).toMatchInlineSnapshot(`"<div id=\\"root\\"><p>15</p></div>"`)
    })
  }

  describe('preact', () => {
    beforeAll(() => {
      jest.resetModules()
      jest.mock('react', () => require('preact-compat'))
      jest.mock('react-dom', () => require('preact-compat'))
    })

    it('check is preact', () => {
      expect(require('react')).toBe(require('preact-compat'))
      expect(require('react-dom')).toBe(require('preact-compat'))
    })
    runTest()
  })

  describe('react', () => {
    beforeAll(() => {
      jest.resetModules()
      jest.unmock('react')
      jest.unmock('react-dom')
    })

    it('check is react', () => {
      expect(require('react')).not.toBe(require('preact-compat'))
      expect(require('react-dom')).not.toBe(require('preact-compat'))
    })
    runTest()
  })
})
