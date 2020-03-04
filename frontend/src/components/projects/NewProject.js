import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

import UserSearchModal from './UserSearchModal'

class NewProject extends React.Component {

  state = {
    data: {
      name: '',
      description: ''
    },
    modal: false,
    users: null,
    userSearch: '',
    usersSelected: [],
    fieldError: false
  }



  handleChange = (event) => {
    const data = { ...this.state.data, [event.target.name]: event.target.value }
    this.setState({ data, fieldError: false })
  }

  handleModal = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.handleGetUsers()
    this.setState({ modal: !this.state.modal })
  }

  handleGetUsers = async () => {
    let { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
    data = data.filter(user => user.id !== this.props.userId)
    this.setState({ users: data })
  }

  handleSearchChange = (event) => {
    this.setState({ userSearch: event.target.value })
  }

  selectUser = (user) => {
    let usersSelected = [ ...this.state.usersSelected ]
    if (usersSelected.includes(user)) {
      usersSelected = usersSelected.filter(item => item !== user)
    } else {
      usersSelected.push(user)
    }
    this.setState({ usersSelected })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const data = { ...this.state.data, users: this.state.usersSelected.map(user => user.id) }
    console.log(data)
    try {
      const res = await axios.post('/api/projects/', data, {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
      this.props.getUserData()
      this.props.history.push(`/project-board/${res.data.id}`)
    } catch (err) {
      if (err.response.data.name) this.setState({ fieldError: true })
      console.log(err.response)
    }
  }

  render() {
    return (
      <section className="project_main">
        <div className="new_project_wrapper">
        <form className="new_project_form" onSubmit={this.handleSubmit}>
          <h1 className="new_project_header">New Project</h1>
          <div className="new_project_content">
            <div className="new_project_input_wrapper">
              <label className="new_project_input_label">Project Name</label>
              <div>
                <input 
                  name="name"
                  className="input new_project_input"
                  onChange={this.handleChange}
                />
                {this.state.fieldError && <span className="error_text">This field is required</span>}
              </div>
            </div>
            <div className="new_project_input_wrapper">
              <label 
                className="new_project_input_label"
              >Description</label>
              <div>
                <textarea 
                  className="new_project_text_field"
                  name="description"
                  onChange={this.handleChange}
                  />
              </div>
            </div>
            <div className="new_project_input_wrapper new_project_user_show_wrapper">
              <button 
                className="new_project_build_team_button button"
                onClick={this.handleModal}
              >Build Your Team</button>
              <div className="new_project_user_show">{
                this.state.usersSelected.map(user => (
                  <div key={user.id} className="new_project_user_display_image" style={{ backgroundImage: `url(${user.image}` }}></div>
                ))
              }</div>
            </div>
          </div>
          <button className="button new_project_submit_button" type="submit">Submit</button>
        </form>
        </div>
        { this.state.modal &&
          <UserSearchModal 
            handleModal={this.handleModal} 
            handleSearchChange={this.handleSearchChange}
            userSearch={this.state.userSearch}
            users={this.state.users}
            selectUser={this.selectUser}
            usersSelected={this.state.usersSelected}
            />
        }
      </section>
    )
  }
}

export default NewProject