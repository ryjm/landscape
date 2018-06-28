import React, { Component } from 'react';
export class CollectionPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snipHtml: ''
    }
    fetch(this.snipUrl(props.messageDetails.postUrl, props.api.authTokens.ship)).then(res => {
      return (res.text())
    }).then(d => {
      this.setState({snipHtml: d});
    });
  }
  dangerousHtml(string) {
    return {__html: string};
  }
  snipUrl(url, ship) {
    if (!url.includes(`~${ship}`)) {
      return `${this.cleanSig(url)}.x-collections-snip`
    } else {
      return `${this.cleanSig(url)}.collections-snip`
    }
  }
  // HACK FOR TESTING
  cleanSig(url) {
    if (url.includes('/~~')) {
      return url.slice(3);
    }
    return url;
  };

  render() {
    if (this.state.snipHtml) {
      return (
        <div className="collection-preview" dangerouslySetInnerHTML={this.dangerousHtml(this.state.snipHtml)}/>
      )
    } else {
      return (
        <div className="collection-preview">{this.props.messageDetails.content}</div>
      )
    }
  }
}
