import React, { Component } from 'react';
import "./Restaurant.css";


class Restaurant extends Component {

  render() {
    var info = [];
    var rows = [];

    this.props.data.portions.forEach((day, idx) => {
      if (idx === this.props.day - 1 && this.props.data.portions[idx] && this.props.data.portions[idx].length > 0) {
        day.forEach((portion, i) => {
            rows.push([
                  <tr key={this.props.data.name + "-" + idx + "-row-" + i} className="portionRow">
                    <td
                      key={this.props.data.name + "-" + idx + "-portion-" + i}
                      className="portion"
                      onClick={() => this.props.toggleLikeWindow(this.props.data.name, idx, i, portion)}
                    >
                      {portion.meal}
                    </td>
                    <td
                      key={this.props.data.name + "-" + idx + "-price-" + i}
                      className="price"
                      onClick={() => this.props.toggleLikeWindow(this.props.data.name, idx, i, portion)}
                    >
                      {portion.price}
                    </td>
                  </tr>
            ]);
        });
        info.push([
          <div key={this.props.data.name}>
            <h3 className="restaurantTitle">{this.props.data.name}</h3>
            <hr className="restaurantHr" />
            <table key={this.props.data.name + "-" + idx} className="portionsTable">
              <tbody>
              {rows}
              </tbody>
            </table>
          </div>
        ]);
      }
    });

    return (
      <div className="restaurant">
        {info}
      </div>
    )
  }
}

export default Restaurant;
