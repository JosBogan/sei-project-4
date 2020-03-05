import React from 'react'
import Auth from '../../lib/auth'

import { withRouter } from 'react-router-dom'

class NavBar extends React.Component {

  handleUserPage = () => {
    this.props.history.push('/project-board/user')
  }

  handleLogout = () => {
    Auth.logout()
    this.props.history.push('/')
  }

  render() {
    return (
      <nav className="navbar">
        <div className="navbar_left">
          <div 
            className="website_icon"
            onClick={this.handleUserPage}
          ></div>
          <div
            onClick={this.props.burgerSwitch} 
            className="burger_menu"
          >
            <div className="burger_menu_line"></div>
            <div className="burger_menu_line"></div>
            <div className="burger_menu_line"></div>
          </div>
        </div>
        <div className="navbar_user_options">
          <button onClick={this.handleLogout} className="logout_button">
            <div className="logout_icon"></div>
            <span className="logout_text">Logout</span>
          </button>
          <div 
            className="nav_user_image" 
            style={{ backgroundImage: `url(${this.props.image}` }}
            onClick={this.handleUserPage}
          ></div>
        </div>
      </nav>
    )
  }
}

export default withRouter(NavBar)