import React, { Component } from 'react';
import { util } from '../../util';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      topicContent: this.props.topText ? this.props.topText : ''
    };
  }

  titleExtract(s) {
    const r = s.split('\n').filter(x => 
      x.startsWith('# ')
    );
    if (r.length > 0) {
      return r[0].slice(2);
    }
    return '';
  }

  createTopic() {
    let dat = {}
    console.log(this.props);
    if (top in this.props) {
      dat = {
        submit: {
          col: this.props.queryParams.coll,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent
        }
      }
    } else {
      dat = {
        resubmit: {
          col: this.props.coll,
          top: this.props.top,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent
        }
      }
    };

    this.props.api.sendCollAction(dat, {
      target: top in this.props ? `/~~/collections/${this.props.coll}/${this.props.top}` : `/~~/collections/${this.props.queryParams.coll}`
    });
  }

  valueChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="create-collection-page">
        <div className="input-group">
          <button 
            onClick={this.createTopic}
            className="btn btn-secondary">
            Save →
          </button>
          <button className="btn btn-primary">
            Preview →
          </button>
        </div>
        <div className="row">
            <textarea
              className="text-code post-edit"
              name="topicContent"
              placeholder="New post"
              value={this.state.topicContent}
              onChange={this.valueChange}
              />
        </div>
      </div>
    )
  }
}
