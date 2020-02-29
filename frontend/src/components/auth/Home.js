import React from 'react'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

class Home extends React.Component{

  state = {
    register: false
  }

  handleRegisterChange = () => {
    this.setState({ register: !this.state.register })
  }

  render() {
    return (
      <main className="landing_main">
        <div className="landing_banner">
          <div className="auth_outer_wrapper">
            <div className={`auth_wrapper ${this.state.register && 'auth_wrapper_register'}`}>
              <h2>{this.state.register ? 'Register' : 'Login'}</h2>
              {
                this.state.register ?
                  <RegisterForm handleRegisterChange={this.handleRegisterChange}/> :
                  <LoginForm {...this.props}/>
              }
            </div>
            <div className="login_register_switch" onClick={this.handleRegisterChange}>
              <span className="login_register_small">go to </span>
              {this.state.register ? 'Login' : 'Register'}
            </div>
          </div>
        </div>
      </main>
    )
  }
}

export default Home