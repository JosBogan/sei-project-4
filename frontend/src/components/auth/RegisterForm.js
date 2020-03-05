import React from 'react'
import axios from 'axios'

import { headers } from '../../lib/headers'

class RegisterForm extends React.Component {

  state = {
    focus: {
      username: null,
      email: null,
      password: null,
      password_confirmation: null
    },
    data: {
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    },
    errors: {
      username: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  }

  handleSumbit = async (event) => {
    event.preventDefault()
    try {
      await axios.post('/api/register/', this.state.data, headers)
      this.props.handleRegisterChange()
    } catch (err) {
      const errors = { ...err.response.data }
      for (const val in errors) {
        console.log(typeof errors[val])
        if (typeof errors[val] !== String ) errors[val] = errors[val][0]
        console.log(errors)
        if (errors[val].includes('blank')) {
          errors[val] = 'required'
        } else if (errors[val].includes('exist')) {
          errors[val] = `${val} already exists`
        }
      }
      this.setState({ errors })
    }
  }

  handleInputFocus = (event) => {
    const focus = { email: null, password: null, username: null, password_confirmation: null }
    const errors = { email: '', password: '', username: '', password_confirmation: '' }
    focus[event.target.name] = true
    this.setState({ focus, errors })
  }

  handleInputBlur = (event) => {
    const focus = { email: null, password: null, username: null, password_confirmation: null }
    const errors = { email: '', password: '', username: '', password_confirmation: '' }
    focus[event.target.name] = null
    this.setState({ focus, errors })
  }

  handleChange = (event) => {
    const data = { ...this.state.data, [event.target.name]: event.target.value }
    const errors = { email: '', password: '', username: '', password_confirmation: '' }
    this.setState({ data, errors })
  }

  render() {
    const { focus, data } = this.state
    return (
      <form onSubmit={this.handleSumbit}>
        <div className="login_wrapper">
          <div>
            <label className={`input_label ${focus.username || data.username ? ' ' : 'input_label_on_focus'}`}>
            Username {this.state.errors.username && <span className="error_text error_text_logreg"> {this.state.errors.username}</span>}
            </label>
            <div>
              <input 
                name="username"
                type="username" 
                className="input" 
                // value={this.state.data.username}
                // required="true" 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <label className={`input_label ${focus.email || data.email ? ' ' : 'input_label_on_focus'}`}>
            Email {this.state.errors.email && <span className="error_text error_text_logreg"> {this.state.errors.email}</span>}
            </label>
            <div>
              <input 
                name="email"
                type="email" 
                className="input" 
                // value={this.state.data.email}
                // required="true" 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <label className={`input_label ${focus.password || data.password ? ' ' : 'input_label_on_focus'}`}>
            Password {this.state.errors.password && <span className="error_text error_text_logreg">{this.state.errors.password}</span>}
            </label>
            <div>
              <input 
                name="password"
                type="password" 
                className="input" 
                // value={this.state.data.password}
                // required="true" 
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div>
            <label className={`input_label ${focus.password_confirmation || data.password_confirmation ? ' ' : 'input_label_on_focus'}`}>
            Password Confirmation {this.state.errors.password_confirmation && <span className="error_text error_text_logreg"> {this.state.errors.password_confirmation}</span>}
            </label>
            <div>
              <input 
                name="password_confirmation"
                type="password" 
                className="input" 
                // value={this.state.data.password_confirmation}
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

export default RegisterForm