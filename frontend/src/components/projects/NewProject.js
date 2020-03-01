import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

class NewProject extends React.Component {

  state = {
    data: {
      name: '',
      description: ''
    },
    modal: false,
    users: null,
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
    const { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
    this.setState({ users: data })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const res = await axios.post('/api/projects/', this.state.data, {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
      this.props.getUserData()
      this.props.history.push(`/project-board/${res.data.id}`)
    } catch (err) {
      if (err.response.data.name) this.setState({ fieldError: true })
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
            <div className="new_project_input_wrapper">
              <button 
                className="new_project_build_team_button button"
                onClick={this.handleModal}
              >Build Your Team</button>
              <div></div>
            </div>
          </div>
          <button className="button new_project_submit_button" type="submit">Submit</button>
        </form>
        </div>
        { this.state.modal &&
        <>
        <div 
          className="modal"
          onClick={this.handleModal}
        >
        </div>
        <div className="modal_content_wrapper">
            <div className="modal_content">
              <h2 className="modal_header">Users</h2>
            <input className="input modal_input"/>
            <div>
              {/* {this.state.users.map(user => {
                <div></div>
              })} */}
            </div>
            </div>
          </div>
        </>
        }
      </section>
    )
  }
}

export default NewProject