/**
 * @file querySelectorAll
 * @author Cuttle Cong
 * @date 2018/11/7
 * @description
 */
const querySelectorAll = require('../src/querySelectorAll')

describe('querySelectorAll', function() {
  beforeAll(() => {
    document.body.innerHTML = `
    <div class="g"></div>
    <span class="g"></span>
    <div id="root"></div>
    `
  })
  it('match single element', () => {
    const root = querySelectorAll('#root')
    expect(root).toMatchInlineSnapshot(`
Array [
  <div
    id="root"
  />,
]
`)
  })

  it('match none element', () => {
    const root = querySelectorAll('#not-here')
    expect(root).toMatchInlineSnapshot(`Array []`)
  })

  it('match multi element', () => {
    const root = querySelectorAll('.g')
    expect(root).toMatchInlineSnapshot(`
Array [
  <div
    class="g"
  />,
  <span
    class="g"
  />,
]
`)
  })

  it('match NodeList', () => {
    expect(querySelectorAll(document.querySelectorAll('.g'))).toEqual(querySelectorAll('.g'))
  })

  it('match array', () => {
    expect([document.querySelector('.g')]).toEqual([querySelectorAll('.g')[0]])
  })

  it('match HTMLElement', () => {
    expect(querySelectorAll(document.querySelector('.g'))).toEqual([document.querySelector('.g')])
  })
})
