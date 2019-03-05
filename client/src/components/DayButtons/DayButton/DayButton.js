import React, { Component } from 'react';
import "./DayButton.css";

class DayButton extends Component {
  render() {
    const dayToText = {
      1: "Maanantai",
      2: "Tiistai",
      3: "Keskiviikko",
      4: "Torstai",
      5: "Perjantai",
      6: "Lauantai",
      7: "Sunnuntai"
    }

    const dayToTextSmallScreen = {
      1: "Ma",
      2: "Ti",
      3: "Ke",
      4: "To",
      5: "Pe",
      6: "La",
      7: "Su"
    }

    return (
      <button
        onClick={() => this.props.changeDayHandler(this.props.buttonDay)}
        className={this.props.day === this.props.buttonDay ? "dayButton selected" : "dayButton"}
      >
        {window.innerWidth > 992 ? dayToText[this.props.buttonDay] : dayToTextSmallScreen[this.props.buttonDay]}
      </button>
    )
  }
}

export default DayButton;
