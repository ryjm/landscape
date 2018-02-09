import React, { Component } from 'react';
import { util } from '../../util';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    console.log('props', props);

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      topicContent: ''
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
    this.props.api.sendCollAction({
      submit: {
        col: this.props.queryParams.coll,
        tit: this.titleExtract(this.state.topicContent),
        wat: this.state.topicContent
      }
    },{
      target: `/~~/collections/${this.props.queryParams.coll}`
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
      <div className="create-collection-page container">
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
