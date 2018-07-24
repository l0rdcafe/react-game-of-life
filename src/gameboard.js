import React from "react";

class GameBoard extends React.Component {
  render() {
    return (
      <div className="boardWrapper">
        <div className="board">{this.props.create}</div>
      </div>
    );
  }
}

export default GameBoard;
