# react-pizza

[![Build status](https://img.shields.io/travis/imcuttle/react-pizza/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/react-pizza)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/react-pizza.svg?style=flat-square)](https://codecov.io/github/imcuttle/react-pizza?branch=master)
[![NPM version](https://img.shields.io/npm/v/react-pizza.svg?style=flat-square)](https://www.npmjs.com/package/react-pizza)
[![NPM Downloads](https://img.shields.io/npm/dm/react-pizza.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/react-pizza)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> The utility for creating (p)react component habitat.

## Feature

- Support react and [preact](https://github.com/developit/preact)
- Set props and call method or get attribute which [preact-habitat](https://github.com/zouhir/preact-habitat) is not supported

## Installation

```bash
npm install react-pizza
# or use yarn
yarn add react-pizza
```

## Usage

```javascript
import * as React from 'react'
import * as pizza from 'react-pizza'

class Timer extends React.Component {
  state = {
    count: this.props.count
  }

  increase() {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    return <p>{this.state.count}</p>
  }
}

// document.body
// <div id="root"></div>
const render = pizza(Timer)
const timer = render('#root', { count: 10 })
// <div id="root"><p>10</p></div>

timer.call('increase') // Call `increase` method
// <div id="root"><p>11</p></div>
timer.ref(0).current.state === timer.ref()[0].current.state) === timer.call('state', 0)
// { count: 11 }

// Set the props of all elements
timer.setProps({ count: 10 })
// Set the prop of #root element
timer.setProps({ count: 10 }, document.querySelect('#root'))
// Set the prop of first element
timer.setProps({ count: 10 }, 0)

// Unmount timer in all elements
timer.remove()

timer.remove(0)
timer.remove(document.querySelect('#root'))

// Mount origin
timer.origin === render.origin
timer.origin === Timer
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
