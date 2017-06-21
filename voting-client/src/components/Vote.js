import React, { PureComponent } from 'react';
import './Vote.css';
import classNames from 'classnames';
export default class Vote extends PureComponent {
   getPair() {
    return this.props.pair || [];
  }
  hasVotedFor(entry) {
    return this.props.hasVoted === entry;
  }

  render() {
    return (
      <div className="voting">
        {this.getPair().map(entry =>
          <button key={entry}
                  className={classNames({voted: this.hasVotedFor(entry)})}
                  onClick={() => this.props.vote(entry)}>
            <h1>{entry}</h1>
            {this.hasVotedFor(entry) ? 
              <div className="label">Voted</div> :
              null}
          </button>
        )}
      </div>
    );
  } 
}

