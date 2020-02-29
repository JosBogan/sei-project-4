import React from 'react'

import Auth from '../../lib/auth'

class User extends React.Component {

  handleLogout = () => {
    Auth.logout()
    this.props.history.push('/')
  }

  componentDidMount() {
    console.log('mouting')
  }
  render() {
    return (
      <section className="project_main">
        <button className="button" onClick={this.handleLogout}>Logout</button>
      </section>
    )
  }
}

export default User