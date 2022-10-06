import React, { Component } from "react";

class Menu extends Component {
  state = {};
  render() {
    return (
      <div className="sidebar-toggle">
        Menü{" "}
        <span className="icon lines-button x">
          <span className="lines"></span>
        </span>
      </div>
    );
  }
}

export default Menu;
