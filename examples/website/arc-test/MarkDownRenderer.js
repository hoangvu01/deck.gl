/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactMarkdown from 'react-markdown'


export default class MarkDownRenderer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content : null
    }
  }

  componentWillMount() {
    fetch(this.props.path)
      .then(response => response.text())
      .then(text => {
        this.setState({
          content: text
        })
      })
  }

  render() {
    const { content } = this.state;

    return(
      <ReactMarkdown escapeHtml={false} source={content} />
    )
  }
}
