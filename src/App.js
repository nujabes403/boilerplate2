import React, { Component, Fragment, createRef } from 'react'
import { fromEvent, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import cx from 'classnames'

import './App.scss'

type Props = {
  isLoading: boolean,
  children: React.DOM,
}

class App extends Component<Props> {
  destroy$ = new Subject()
  
  $app = createRef()
  
  state = {
    isLoading: true,
  }
  
  componentDidMount() {
    
  }
  
  componentWillUnmount() {
    this.destroy$.next(true)
  }

  render() {
    const { children } = this.props

    return (
      <div ref={this.$app} className="App">
        Hello World!
        {children}
      </div>
    )
  }
}

export default App
