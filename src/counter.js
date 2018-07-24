import React from "react";

class Counter extends React.Component {
  render() {
    return (
      <div className="counter">
        Generation: <div>{this.props.count}</div>
      </div>
    );
  }
}

export default Counter;
