import React, { Component } from "react";
import Menu from "./menu";

class Header extends Component {
  state = {};
  render() {
    return (
      <header>
        <div className="wrapper">
          <div id="logo" className="scrollspy">
            <a href="http://localhost:3000/" target="_blank">
              <img
                src="./logo_ifcjs.png"
                width="212"
                height="80"
                alt="ifc viewer"
              />
            </a>
          </div>

          <Menu />
          <div id="breadcrumb"></div>
        </div>
      </header>
    );
  }
}

export default Header;
