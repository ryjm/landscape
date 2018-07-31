import React, { Component } from 'react';
import { PAGE_STATUS_TRANSITIONING, STATUS_READY, STATUS_LOADING, REPORT_PAGE_STATUS } from '/lib/constants';
import { Button } from '/components/lib/button';

export class CommentCreate extends Component {
  constructor(props) {
    super(props);
    this.createComment = this.createComment.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      comment: '',
      status: STATUS_READY
    };
    let loc = window.location.pathname;
    this.pageShip = loc.includes("/==/web") ? loc.split('/')[2] : `~${props.api.authTokens.ship}`
  }

  createComment() {
    this.setState({ status: STATUS_LOADING });

    this.props.api.coll({
      comment: {
        col: this.props.coll,
        top: this.props.top,
        com: '~',
        wat: this.state.comment,
        hos: this.pageShip
      }
    });

    this.props.storeReports([{
      type: REPORT_PAGE_STATUS,
      data: PAGE_STATUS_TRANSITIONING
    }]);

    this.props.pushCallback("circle.gram", (rep) => {
      this.setState({ comment: '', status: STATUS_READY});

      this.props.transitionTo(this.pageShip == this.props.api.authTokens.ship ? `/~~/collections/${this.props.coll}/${this.props.top}` : `/~~/${this.pageShip}/==/web/collections/${this.props.coll}/${this.props.top}`)
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
  //

  render() {
    return (
      <div className="create-comment">
        <div className="usership text-mono">
          ~{this.props.api.authTokens.ship}
        </div>
        <textarea
          value={this.state.comment}
          onChange={this.valueChange}
          name="comment"
          className="comment-edit mb-3"
          disabled={this.state.status === STATUS_LOADING}
          placeholder="Post a comment">
        </textarea>
        <Button
          classes="btn btn-tetiary"
          disabled={this.state.comment.length === 0 || this.state.status === STATUS_LOADING}
          action={this.createComment}
          responseKey="circle.gram"
          pushCallback={this.props.pushCallback}
          content="Publish →" />
      </div>
    )
  }
}
