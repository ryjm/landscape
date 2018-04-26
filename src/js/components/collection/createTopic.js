import React, { Component } from 'react';
//import { util } from '../../util';

export class TopicCreatePage extends Component {
  constructor(props) {
    super(props);

    this.createTopic = this.createTopic.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      topicContent: this.props.text ? this.props.text : ''
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
    //
    if ('top' in this.props) {
      dat = {
        resubmit: {
          col: this.props.coll,
          top: this.props.top,
          tit: this.titleExtract(this.state.topicContent),
          wat: this.state.topicContent
        }
      }
    } else {
      // this means that we're using "latest"
      if ('coll' in this.props) {
        dat = {
          submit: {
            col: this.props.coll,
            tit: this.titleExtract(this.state.topicContent),
            wat: this.state.topicContent
          }
        }
      } else {
        dat = {
          submit: {
            col: this.props.queryParams.coll,
            tit: this.titleExtract(this.state.topicContent),
            wat: this.state.topicContent
          }
        }
      }
    };

    console.log('dat...', dat);

    var target;

    if ('coll' in this.props && 'top' in this.props) {
      // this means that it is an edit
      target = `/~~/collections/${this.props.coll}/${this.props.top}`;
    } else if ('coll' in this.props) {
      // this means that it is from a "latest" page
      target = `/~~/collections/${this.props.coll}/latest`;
    } else {
      // normal-ass page
      target = `/~~/collections/${this.props.queryParams.coll}/latest`;
    };

    console.log('transition to...', target);

    this.props.api.coll(dat);

    this.props.pushPending("circles", {
      type: "subscribe-inbox"
    });

    this.props.pushPending("circle.config.dif.full", {
      type: "transition",
      data: {
        target
      }
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
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-2 col-sm-10">
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
          </div>
        </div>
      </div>
    )
  }
}
