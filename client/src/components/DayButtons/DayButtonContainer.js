import React, { Component } from 'react';
import DayButton from "./DayButton/DayButton";
import "./DayButtonContainer.css";



class DayButtonContainer extends Component {

  render() {
    var buttons = [];

    for (var i=1; i<=7; i++) {
      buttons.push(
        <DayButton
          key={"dayButton-" + i}
          buttonDay={i}
          day={this.props.day}
          changeDayHandler={this.props.changeDayHandler}
        />
      )
    }

    return (
      <div className="dayButtonContainer">
        {buttons}
      </div>
    )
  }
}

export default DayButtonContainer;
