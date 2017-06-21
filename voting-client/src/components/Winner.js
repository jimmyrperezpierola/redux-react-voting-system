import React, { PureComponent } from 'react';
import './Winner.css';

export default class Winner extends PureComponent {
  render() {
    return <div className="winner">
      Winner is {this.props.winner}!
    </div>;
  }
}