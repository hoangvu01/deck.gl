/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactMarkdown from 'react-markdown'

import content from './README.md';

class App extends Component {
  render() {
    return(
      <ReactMarkdown source={content} />
    )
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
