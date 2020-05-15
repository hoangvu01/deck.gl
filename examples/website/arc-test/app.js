/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactMarkdown from 'react-markdown'
import MarkDownRenderer from './MarkDownRenderer';

import content from './README.md';

class App extends Component {
  render() {
    return(
      <MarkDownRenderer path={'./README.md'} />
    )
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
