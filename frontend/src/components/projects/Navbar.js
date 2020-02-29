import React from 'react'
import { withRouter } from 'react-router-dom'

class NavBar extends React.Component {

  handleUserPage = () => {
    this.props.history.push('/project-board/user')
  }

  render() {
    return (
      <nav className="navbar">
        <div 
          className="nav_user_image" 
          style={{ backgroundImage: `url(${this.props.image}` }}
          onClick={this.handleUserPage}
        ></div>
      </nav>
    )
  }
}

export default withRouter(NavBar)