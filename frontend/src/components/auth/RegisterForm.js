import React from 'react'

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
    }
  }

  handleSumbit = (event) => {
    event.preventDefault()
  }

  handleInputFocus = (event) => {
    const focus = { email: null, password: null, username: null, password_confirmation: null }
    focus[event.target.name] = true
    this.setState({ focus })
  }

  handleInputBlur = (event) => {
    const focus = { email: null, password: null, username: null, password_confirmation: null }
    focus[event.target.name] = null
    this.setState({ focus })
  }

  handleChange = (event) => {
    const data = { ...this.state.data, [event.target.name]: event.target.value }
    this.setState({ data })
  }

  render() {
    const { focus, data } = this.state
    return (
      <form onSubmit={this.handleSumbit}>
        <div className="login_wrapper">
        <div>
          <label className={`input_label ${focus.username || data.username ? ' ' : 'input_label_on_focus'}`}>Username</label>
          <div>
          <input 
            name="username"
            type="username" 
            className="input" 
            // required="true" 
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onChange={this.handleChange}
          />
          </div>
        </div>
        <div>
          <label className={`input_label ${focus.email || data.email ? ' ' : 'input_label_on_focus'}`}>Email</label>
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
          <label className={`input_label ${focus.password || data.password ? ' ' : 'input_label_on_focus'}`}>Password</label>
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
          <label className={`input_label ${focus.password_confirmation || data.password_confirmation ? ' ' : 'input_label_on_focus'}`}>Password Confirmation</label>
          <div>
          <input 
            name="password_confirmation"
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

export default RegisterForm