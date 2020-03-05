import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

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

  imageUpload = async (event) => {
    console.log(event.target.files)

    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', 'hmrrfxib')
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_USER_KEY}/image/upload`, data)
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
    const { tasks } = user
    console.log(tasks)
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
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') return this.editUserProfile(event)
                  }}
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
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') return this.editUserProfile(event)
                  }}
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
          <div className="user_tasks_wrapper">
            <h2 className="user_tasks_header">My Tasks</h2>
            <div>
              {tasks.map(taskCol => {
                const task = taskCol.task
                return (
                  <Link key={task.id} to={`/project-board/${task.project}`}>
                    <div key={task.id} className="task_container">
                      <div className="task_colour" style={{ background: '#6ECAB5' }}></div>
                      <div className="task_content_container">
                        <p className="task_text no_click">{task.text}</p>
                        {task.columns.map(column => (
                          <div 
                            key={column.id} 
                            className={`task_column_outer no_click task_column_${column.col_type} task_column_${column[column.col_type]}`}
                          >
                            <div className="task_column">
                              {column.col_type === 'users' &&
                      <div 
                        className="user_column_image user_column_padding" 
                        // style={{ backgroundImage: `url('${column.users[0] && project.users.find(user => user.id === column.users[0]).image}')` }
                      >
                      </div>
                              }
                              {column.col_type === 'numbers' && column[column.col_type]}
                              {column.col_type === 'text' && column[column.col_type]}
                              {column.col_type === 'priority' && column[column.col_type]}
                              {column.col_type === 'status' && column[column.col_type]}
                              {column.col_type === 'date' && column[column.col_type]}
                              {column.col_type === 'file' && column[column.col_type] && <div className={`column_file_iconpointer_evencolumn_file_${column[column.col_type].split('.').pop()}`}></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default User