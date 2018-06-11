import React, { Component } from 'react';
export class CollectionPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snipHtml: ''
    }
    console.log(props);
    fetch(`${this.cleanSig(props.messageDetails.postUrl)}.collections-snip`).then(res => {
      return (res.text())
      //setState({snipHtml: d});
    }).then(d => {
      this.setState({snipHtml: d});
    });
  }
  dangerousHtml(string) {
    return {__html: string};
  }
  // HACK FOR TESTING
  cleanSig(url) {
    if (url.includes('/~~')) {
      return url.slice(3);
    }
    return url;
  };

  render() {
    return (
      <div className="collection-preview" dangerouslySetInnerHTML={this.dangerousHtml(this.state.snipHtml)}/>
    )
  }
}
