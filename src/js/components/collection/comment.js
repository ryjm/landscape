
import React, { Component } from 'react';
import { util } from '../../util';

export class CommentCreate extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.createComment = this.createComment.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      comment: ''
    };
  }

  createComment() {
    this.props.api.sendCollAction({
      comment: {
        col: this.props.coll,
        top: this.props.top,
        com: '~',
        wat: this.state.comment
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
  //

  render() {
    return (
      <div className="create-comment">
        <div className="usership">
          ~{this.props.store.usership}
        </div>
        <textarea 
          value={this.state.comment}
          onChange={this.valueChange}
          name="comment"
          className="comment-edit mb-3"
          placeholder="Post a comment">
        </textarea>
        <button
          onClick={this.createComment}
          className={this.state.comment.length > 0 ? "btn btn-tetiary" : "btn disabled"}>
          Publish →
        </button>
        
      </div>
    )
  }
}
