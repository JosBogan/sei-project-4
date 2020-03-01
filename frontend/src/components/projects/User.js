import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

class User extends React.Component {

  state = {
    user: null,
    username: {
      edit: false,
      text: ''
    },
    email: {
      edit: false,
      text: ''
    }
  }

  handleLogout = () => {
    Auth.logout()
    this.props.history.push('/')
  }

  imageUpload = async (event) => {
    console.log(event.target.files)
    const data = new FormData
    data.append('file', event.target.files[0])
    data.append('upload_preset', 'hmrrfxib')
    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dzctontbo/image/upload', data)
      const updated_user = { ...this.state.user, image: res.data.url }
      await axios.put('/api/users/me/', updated_user, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.props.getUserData()
      this.getUserData()
    } catch (err) {
      console.log(err.response)
    }
  }

  editUserProfile = async (event) => {
    const name = event.target.getAttribute('name')
    try {
      const updated_user = { ...this.state.user, [name]: this.state[name].text }
      console.log(updated_user)
      const res = await axios.put('/api/users/me/', updated_user, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      console.log(res)
      this.getUserData()
    } catch (err) {
      console.log(err.response)
    }
  }

  handleTextChange = (event) => {
    const name = event.target.getAttribute('name')
    const edit = { ...this.state[name], text: event.target.value }
    console.log(edit)
    this.setState({ [name]: edit })
  }

  handleChangeEditState = (event) => {
    const name = event.target.getAttribute('name')
    const edit = { ...this.state[name], edit: true }
    // console.log(edit)
    this.setState({ [name]: edit })
  }

  getUserData = async () => {
    const { data } = await axios.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
    const username = { edit: false, text: data.username }
    const email = { edit: false, text: data.email }
    // console.log(username, email)
    this.setState({ user: data, username, email })
  }

  componentDidMount() {
    this.getUserData()
  }
  render() {
    if (!this.state.user) return null
    const { user } = this.state
    return (
      <section className="project_main">
        <div className="user_page_wrapper">
          <div className="user_page_header">
            <label htmlFor="upload_image"><div className="user_page_image" style={{ backgroundImage: `url(${user.image}` }}></div></label>
            <input 
              type="file"
              className="user_page_image_input"
              id="upload_image"
              onChange={this.imageUpload}
            />
            <div className="user_page_info">
              {this.state.username.edit ?
              <input 
                autoFocus
                name="username"
                onChange={this.handleTextChange}
                onBlur={this.editUserProfile}
                onKeyPress={(event) => {if (event.key === "Enter") return this.editUserProfile(event)}}
                className="user_page_username_edit"
                value={this.state.username.text}
                />
                :
              <h1 
                name="username"
                onClick={this.handleChangeEditState}
                className="user_page_username">{user.username}<span className="edit_username_icon"></span></h1>
              }
              {this.state.email.edit ?
              <input 
                autoFocus
                name="email"
                onChange={this.handleTextChange}
                onBlur={this.editUserProfile}
                onKeyPress={(event) => {if (event.key === "Enter") return this.editUserProfile(event)}}
                className="user_page_email_edit"
                value={this.state.email.text}
              /> :
              <h3 
                name="email"
                onClick={this.handleChangeEditState}
                className="user_page_email">{user.email}<span className="edit_email_icon"></span></h3>
              }
            </div>
          </div>
          <button className="button" onClick={this.handleLogout}>Logout</button>
        </div>
      </section>
    )
  }
}

export default User