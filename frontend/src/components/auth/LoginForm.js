import React from 'react'
import axios from 'axios'

import { headers } from '../../lib/headers'
import Auth from '../../lib/auth'

class LoginForm extends React.Component {

  state = {
    focus: {
      email: null,
      password: null
    },
    data: {
      password: '',
      email: ''
    },
    error: ''
  }

  handleSumbit = async (event) => {
    event.preventDefault()
    try {
      const res = await axios.post('/api/login/', this.state.data, headers)
      console.log(headers)
      Auth.setToken(res.data.token)
      this.props.history.push('/project-board')
    } catch (err) {
      this.setState({ error: err.response.data.message })
    }
  }

  handleInputFocus = (event) => {
    const focus = { email: null, password: null }
    focus[event.target.name] = true
    this.setState({ focus, error: '' })
  }

  handleInputBlur = (event) => {
    const focus = { email: null, password: null }
    focus[event.target.name] = null
    this.setState({ focus, error: '' })
  }

  handleChange = (event) => {
    const data = { ...this.state.data, [event.target.name]: event.target.value }
    this.setState({ data, error: '' })
  }

  render() {
    const { focus, data } = this.state
    return (
      <form onSubmit={this.handleSumbit}>
        <div className="login_wrapper">
          <div>
            <label className={`input_label ${focus.email || data.email ? ' ' : 'input_label_on_focus'}`}>
              Email <span className="error_text error_text_logreg">{this.state.error}</span>
              </label>
            <div>
              <input 
                name="email"
                type="email" 
                className="input" 
                // required="true" 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <label className={`input_label ${focus.password || data.password ? ' ' : 'input_label_on_focus'}`}>
              Password <span className="error_text error_text_logreg">{this.state.error}</span>
              </label>
            <div>
              <input 
                name="password"
                type="password" 
                className="input" 
                // required="true" 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <button 
              className="button" 
              type="submit"
            >Submit</button>
          </div>
        </div>
      </form>
    )
  }
}

export default LoginForm