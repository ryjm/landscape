import React, { Component } from 'react';
import { PAGE_STATUS_TRANSITIONING, STATUS_READY, STATUS_LOADING } from '/lib/constants';
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

    //  This gets '=='  ??
    this.pageShip = loc.includes("/==/web") ? loc.split('/')[2] : `~${props.api.authTokens.ship}`

    this.pageShip2 = loc.includes("/==/web") ? 
      loc.split('/')[1].slice(1) : 
      `~${props.api.authTokens.ship}`.slice(1)

    this.clayPath = loc.includes("/==/web") ? 
      '/' + loc.split('/').slice(3).join('/') : 
      '/web/' + loc.split('/').slice(2).join('/');

  }

  createComment() {
    this.setState({ status: STATUS_LOADING });

    this.props.api.coll({
        ship: this.pageShip2,
        desk: 'home',
        acts: [{
          comment: {
            path: this.clayPath,
            content: this.state.comment,
          }
        }]
    });

    this.props.storeReports([{
      type: "transition",
      data: PAGE_STATUS_TRANSITIONING
    }]);

    this.props.pushCallback("circle.gram", (rep) => {
    this.setState({ comment: '', status: STATUS_READY});

   //   this.props.transitionTo(this.pageShip == this.props.api.authTokens.ship ? `/~~/collections/${this.props.coll}/${this.props.top}` : `/~~/${this.pageShip}/==/web/collections/${this.props.coll}/${this.props.top}`)
    
    this.props.transitionTo(window.location.pathname); // any reason we shouldnt do this?
    
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
