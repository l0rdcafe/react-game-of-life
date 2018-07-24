import React from "react";

class Controls extends React.Component {
  render() {
    return (
      <div onClick={this.props.handleClick} title={this.props.tooltip} className={this.props.class}>
        {this.props.label}
      </div>
    );
  }
}

export default Controls;
