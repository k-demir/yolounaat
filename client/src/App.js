import React, { Component } from 'react';
import Restaurant from "./components/Restaurant/Restaurant";
import DayButtonContainer from "./components/DayButtons/DayButtonContainer";
import LikeWindow from "./components/LikeWindow/LikeWindow";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.apiUrl = "/api/foods"
    this.state = {
      data: [],
      selectedDay: (new Date().getDay() === 0 ? 7 : new Date().getDay()),
      dim: false,
      displayLikeWindow: false,
      likeWindowProps: {
        restaurantName: "",
        day: 0,
        idx: 0,
        portion: ""
      }
    }
  }

  componentDidMount() {
    fetch(this.apiUrl, {
      method: "GET",
      headers: {'Content-Type':'application/json'}
    })
      .then(res => res.json())
      .then(resJson => resJson.sort(function(a, b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);}))
      .then(resJson => {
        this.setState({data: resJson})
      });
  }

  handleSelectedDayChange = (day) => {
    console.log(day)
    this.setState({selectedDay: day});
  }

  toggleDimming = () => {
    this.setState(prevState => ({
      dim: !prevState.dim
    }));
  }

  toggleLikeWindow = (restaurantName, day, i, portion) => {
    // Work in progress
    return;
    if (portion != undefined && portion.meal != undefined && portion.meal.includes("LATE LUNCH MENU")) {
      return;
    }
    this.toggleDimming();
    this.setState(prevState => ({
      displayLikeWindow: !prevState.displayLikeWindow,
      likeWindowProps: {
        restaurantName: restaurantName,
        day: day,
        idx: i,
        portion: portion
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <div className={this.state.dim ? "dimmer active" : "dimmer"} onClick={this.toggleLikeWindow}></div>
        <DayButtonContainer day={this.state.selectedDay} changeDayHandler={this.handleSelectedDayChange} />
        {this.state.data.map((restaurant, idx) => (
          <Restaurant
            key={"restaurant-" + idx}
            data={restaurant}
            day={this.state.selectedDay}
            toggleDimming={this.toggleDimming}
            toggleLikeWindow={this.toggleLikeWindow}
          />
        ))}
        {this.state.displayLikeWindow ?
          <LikeWindow
            restaurantName={this.state.likeWindowProps.restaurantName}
            day={this.state.likeWindowProps.day}
            idx={this.state.likeWindowProps.idx}
            portion={this.state.likeWindowProps.portion}
          />
        : null}
      </div>
    );
  }
}

export default App;
