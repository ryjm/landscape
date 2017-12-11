import React, { Component } from 'react';

export class NotesIndexPage extends Component {
  constructor(props) {
    super(props)
    /* from talk? */
    var notes = [{
      timestamp: "~20m",
      date: "~2017.11.12..9.35",
      desc: "Imagine it with no effects, no music, no nothing."
    },{
      timestamp: "~2h",
      date: "~2017.11.10..15.12",
      desc: "Not only was the cost of the First World War enormous in terms of lives, but it was also financially crippling to Europe."
    },{
      timestamp: "~3h",
      date: "~2017.11.12..8.15",
      desc: "They were re-arming."
    },{
      timestamp: "~3h",
      date: "~2017.11.12..8.15",
      desc: "I hope not."
    },{
      timestamp: "~1d",
      date: "~2017.11.12..8.15",
      desc: "I’m like you in that I’m an analog guy. As you know, I like wet plate photography."
    }];

    this.state = {};

    this.state.noteElems = notes.map((note) => {
      return (
        <li className="notes-index-note" key={note.desc}>
          <b className="note-timestamp">{note.timestamp}</b>
          <div>
            <a href="show"><h3 className="text-400 underline text-mono">{note.date}</h3></a>
            <p>{note.desc}</p>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-offset-1 col-sm-10 page-notes-index">
            <div className="text-mono">~2017.11.12..4.50</div>
            <h1>Brighter than the sun notes</h1>
            <div className="notes-actions">
              <button className="btn btn-secondary">Write →</button>
              <a href="#">Settings →</a>
            </div>
            <ul className="notes-blurbs">
              {this.state.noteElems}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
