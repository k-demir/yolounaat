import React, { Component } from 'react';
import "./LikeWindow.css";

class LikeWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      star1: false,
      star2: false,
      star3: false,
      star4: false,
      star5: false,
    }
  }

  hoverOn = (idx) => {
    var newState = {};
    for (var i=1; i <= idx; i++) {
      newState["star"+i] = true;
    }
    this.setState(newState);
  }

  hoverOff() {
    this.setState({
      star1: false,
      star2: false,
      star3: false,
      star4: false,
      star5: false,
    })
  }

  render() {
    return (
      <div className="likeWindow">
        <div id="top">
          <h3 id="portionTitle">{this.props.portion.meal}</h3>
          <hr id="hr1" />
        </div>
        <div id="bottom">
          <div className="stars">
            <i className={this.state.star1 ? "fas fa-star" : "far fa-star"} onMouseEnter={() => this.hoverOn(1)} onMouseLeave={() => this.hoverOff()}></i>
            <i className={this.state.star2 ? "fas fa-star" : "far fa-star"} onMouseEnter={() => this.hoverOn(2)} onMouseLeave={() => this.hoverOff()}></i>
            <i className={this.state.star3 ? "fas fa-star" : "far fa-star"} onMouseEnter={() => this.hoverOn(3)} onMouseLeave={() => this.hoverOff()}></i>
            <i className={this.state.star4 ? "fas fa-star" : "far fa-star"} onMouseEnter={() => this.hoverOn(4)} onMouseLeave={() => this.hoverOff()}></i>
            <i className={this.state.star5 ? "fas fa-star" : "far fa-star"} onMouseEnter={() => this.hoverOn(5)} onMouseLeave={() => this.hoverOff()}></i>
          </div>
          {this.props.portion.allergies}
          <button id="notServedButton">
            Loppunut?
          </button>
        </div>
      </div>
    )
  }
}

export default LikeWindow;
