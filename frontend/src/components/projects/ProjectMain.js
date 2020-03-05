import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

import StatusPicker from './popups/StatusPicker'
import UserSearchModal from './UserSearchModal'
import NumberPicker from './popups/NumberPicker'
import ChatModal from './ChatModal'
import PriorityPicker from './popups/PriorityPicker'
import UserPicker from './popups/UserPicker'
import TextPicker from './popups/TextPicker'
import DatePicker from './popups/DatePicker'
import FilePicker from './popups/FilePicker'

class ProjectMain extends React.Component {

  state = {
    project: null,
    popup: {
      open: false,
      type: null,
      location: {
        top: null,
        left: null
      }
    },
    column: null,
    newTask: false,
    newTaskText: '',
    editTask: null,
    editTaskText: '',
    edit: {
      name: false,
      description: false,
      newName: '',
      newDescription: ''
    },
    newColumnOpen: false,
    modal: {
      open: false,
      type: null
    },
    chatModal: false,
    users: [],
    userSearch: '',
    usersSelected: []
  }

  async componentDidMount() {
    this.getProjectData()
      .then(() => this.handleGetUsers())
  }

  getProjectData = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
      data.tasks.forEach(task => {
        task.columns.sort((a,b) => a.col_id - b.col_id)
      })
      data.tasks.sort((a, b) => a.id - b.id)
      console.log(data)
      this.setState({ 
        project: data, 
        newTask: false, 
        edit: { ...this.state.edit, newName: data.name, newDescription: data.description },
        editTask: null,
        editTaskText: ''
      })
    } catch (err) {
      console.log(this.props.history.push('/project-board/notfound'))
      // this.props.history.push
    }
  }

  handlePopup = (event, column) => {
    const dimensions = event.target.getBoundingClientRect()
    const navbarHeight = document.querySelectorAll('.navbar')[0].offsetHeight
    const sidebarWidth = document.querySelectorAll('.sidebar')[0].offsetWidth
    const elementScroll = document.querySelectorAll('.project_main')[0].scrollTop
    const top = dimensions.top + dimensions.height - navbarHeight + elementScroll
    const left = dimensions.left - sidebarWidth
    const popup = { ...this.state.popup, open: !this.state.popup.open, type: column.col_type, location: { ...this.state.popup.location, top, left } }
    this.setState({ popup, column, newColumnOpen: false })
  }

  handleSetColumn = async (event) => {
    const dataType = event.target.getAttribute('data-type')
    let dataValue 
    if (event.target.getAttribute('data-value')) {
      dataValue = event.target.getAttribute('data-value')
    } else {
      if (typeof event.target.value === 'string') {
        dataValue = event.target.value
      } else if (typeof event.target.value === 'number') {
        dataValue = parseFloat(event.target.value)
      } else {
        dataValue = ''
      }
    }
    this.closePopUp()
    try {
      await axios.put(`/api/projects/${this.state.project.id}/columns/${this.state.column.col_id}/${this.state.column.id}/`,
        { [dataType]: dataValue }, {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        })
      this.getProjectData()
    } catch (err) {
      console.log(err.response)
    }
  }

  handleFileUpload = async (event) => {
    this.closePopUp()
    console.log(event.target.files)
    const data = new FormData()
    data.append('file', event.target.files[0])
    data.append('upload_preset', 'yjf5g5uc')
    try {
      const fileRes = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_USER_KEY}/raw/upload`, data)
      await axios.put(`/api/projects/${this.state.project.id}/columns/${this.state.column.col_id}/${this.state.column.id}/`,
        { file: fileRes.data.url }, {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        })
      this.getProjectData()
    } catch (err) {
      console.log(err.response)
    }
  }

  handleSetUserColumn = async (event) => {
    this.closePopUp()
    const dataValue = event.target.getAttribute('data-value')
    try {
      await axios.put(`/api/projects/${this.state.project.id}/columns/${this.state.column.col_id}/${this.state.column.id}/`,
        { users: [dataValue] }, {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        })
      this.getProjectData()
    } catch (err) {
      console.log(err.response)
    }
  }

  taskDelete = async (taskId) => {
    try {
      await axios.delete(`/api/projects/${this.state.project.id}/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.closePopUp()
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  columnDelete = async (colId) => {
    console.log(colId)
    try {
      await axios.delete(`/api/projects/${this.state.project.id}/columns/${colId}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.closePopUp()
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  deleteProject = async () => {
    try {
      await axios.delete(`/api/projects/${this.state.project.id}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.props.getUserData()
      this.props.history.push('/project-board/user')
    } catch (err) {
      console.log(err.response)
    }
  }

  toggleChatModal = () => {
    console.log('chat modal')
    this.setState({ chatModal: !this.state.chatModal })
  }

  userColumnChangeRequest = async (column) => {
    try {
      await axios.put(`/api/projects/${this.state.project.id}/columns/${column.col_id}/${column.id}/`,
        { users: [] }, {
          headers: {
            Authorization: `Bearer ${Auth.getToken()}`
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  handleModal = async () => {
    if (this.state.modal.open) {
      const request = { 
        name: this.state.project.name, 
        owner: this.state.project.owner, 
        description: this.state.project.description, 
        users: this.state.usersSelected.map(user => user.id)
      }
      try {
        const res = await axios.put(`/api/projects/${this.state.project.id}/`, request, {
          headers: { Authorization: `Bearer ${Auth.getToken()}` }
        })
        const user_columns = this.state.project.tasks.map(task => task.columns).flat().filter(column => column.col_type === 'users')
        user_columns.forEach(column => {
          if (!res.data.users.includes(column.users[0])) {
            this.userColumnChangeRequest(column)
          }
        })
        this.getProjectData()
        this.getUserData()
      } catch (err) {
        console.log(err)
      }
    }
    const modal = { ...this.state.modal, open: !this.state.modal.open }
    this.setState({ modal })
  }

  newRowTextField = () => {
    this.setState({ newTask: true })
  }

  newRow = async (event) => {
    if (!event.target.value) return this.setState({ newTask: false })
    try {
      await axios.post(`/api/projects/${this.state.project.id}/tasks/`, {
        text: event.target.value
      }, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  newColumnOpen = () => {
    this.closePopUp()
    this.setState({ newColumnOpen: !this.state.newColumnOpen })
  }

  newColumn = async (event) => {
    const type = event.target.getAttribute('name')
    try {
      await axios.post(`/api/projects/${this.state.project.id}/columns/`, { col_type: type }, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
    this.newColumnOpen()
  }

  handleChange = (event) => {
    const edit = { ...this.state.edit, [event.target.name]: event.target.value }
    this.setState({ edit })
  }

  handleTaskChange = (event) => {
    this.setState({ editTaskText: event.target.value })
  }

  setEdit = (event) => {
    const edit = { ...this.state.edit, [event.target.getAttribute('name')]: true }
    this.setState({ edit })
  }

  sendEdit = async (event) => {
    event.preventDefault()
    const request = { name: this.state.edit.newName, owner: this.state.project.owner, description: this.state.edit.newDescription }
    try {
      await axios.put(`/api/projects/${this.state.project.id}/`, request, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
    } catch (err) {
      console.log(err)
    }
    const edit = { ...this.state.edit, name: false, description: false }
    this.getProjectData()
    this.props.getUserData()
    this.setState({ edit })
  }

  editTaskText = (taskId, taskText) => {
    this.setState({ editTask: taskId, editTaskText: taskText })
  }

  sendTaskEdit = async (taskId) => {
    try {
      await axios.put(`/api/projects/${this.state.project.id}/tasks/${taskId}/`, { text: this.state.editTaskText }, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err.response)
    }
  }

  closePopUp = () => {
    const popup = { ...this.state.popup, open: false, location: { ...this.state.popup.location } }
    this.setState({ popup })
  }

  // User Edit Functions 

  handleGetUsers = async () => {
    let { data } = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
    data = data.filter(user => user.id !== this.state.project.owner)
    this.setState({ users: data, usersSelected: this.state.project.users })
  }

  handleSearchChange = (event) => {
    this.setState({ userSearch: event.target.value })
  }

  selectUser = (user) => {
    let usersSelected = [ ...this.state.usersSelected ]
    if (usersSelected.map(user => user.id).includes(user.id)) {
      usersSelected = usersSelected.filter(item => item.id !== user.id)
    } else {
      usersSelected.push(user)
    }
    this.setState({ usersSelected })
  }


  async componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.getProjectData()
        .then(() => this.handleGetUsers())
    }
  }

  render() {
    if (!this.state.project) return null
    const { project, popup } = this.state
    return (
      <section className="project_main">
        { popup.open && 
          <div className="popup_wrapper">
            <div className="column_popup" style={{ top: `${popup.location.top}px`, left: `${popup.location.left}px` }}>
              {popup.type === 'status' && <StatusPicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>}
              {popup.type === 'numbers' && <NumberPicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>}
              {popup.type === 'priority' && <PriorityPicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>}
              {popup.type === 'users' && <UserPicker closePopUp={this.closePopUp} handleSetUserColumn={this.handleSetUserColumn} users={project.users}/>}
              {popup.type === 'text' && <TextPicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>}
              {popup.type === 'date' && <DatePicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>}
              {popup.type === 'file' && <FilePicker closePopUp={this.closePopUp} handleFileUpload={this.handleFileUpload} column={this.state.column}/>}
            </div>
          </div>
        }
        <div className="project_container">
          <div className="project_header">
            <div className="project_info_text">
              {!this.state.edit.name ?
                <h1
                  className="project_name project_header_edit_click"
                  name="name"
                  onClick={this.setEdit}
                >{project.name}<span className="edit_project_name_icon"></span></h1> :
                <form onSubmit={this.sendEdit}>
                  <input 
                    className="input project_header_edit" 
                    name="newName"
                    onChange={this.handleChange}
                    autoFocus
                    onBlur={this.sendEdit}
                    value={this.state.edit.newName}/>
                </form>
              }
              {!this.state.edit.description ?
                <p 
                  className="project_description project_header_edit_click"
                  name="description"
                  onClick={this.setEdit}
                >{project.description}<span className="edit_project_description_icon"></span></p> :
                <textarea
                  className="project_description project_edit_description"
                  name="newDescription"
                  onChange={this.handleChange}
                  autoFocus
                  onBlur={this.sendEdit}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') return this.sendEdit(event)
                  }}
                  value={this.state.edit.newDescription}
                />
              }
            </div>
            <div 
              onClick={this.handleModal}
              className="project_users">
              <h3 className="project_users_title ">Users</h3>
              <div className="project_user_show">{this.state.usersSelected.map(user => (
                <div 
                  key={user.id} 
                  className="new_project_user_display_image" 
                  style={{ backgroundImage: `url(${user.image}` 
                  }}></div>
              ))}</div>
            </div>
          </div>
          <div className="project_line_break"></div>
          <div className="table_container_outer">
            <div className="table_container">
              {/*  Header */}
              <div className="task_container col_header_container">
                <div className="task_colour col_header_invis" style={{ background: '#6ECAB5' }}></div>
                <div className="task_content_container">
                  <p className="task_text col_header_invis">
                    <span 
                      onClick={this.toggleChatModal}
                      className="project_chat_icon"
                    ></span>
                    <span 
                      onClick={this.deleteProject}
                      className="project_delete_icon"
                    ></span>
                  </p>
                  {project.tasks[0] && project.tasks[0].columns.map(column => (
                    <div 
                      key={column.id} 
                      className="task_column_outer_no_hover"
                      // onClick={(event) => this.handlePopup(event, column)}
                    >
                      <div className="task_column">
                        {column.col_type}
                        {/* <span className="column_delete"></span> */}
                      </div>
                      <div 
                        className="column_delete"
                        onClick={() => this.columnDelete(column.col_id)}
                      ></div>
                    </div>
                  ))}
                  {/* <div className="new_task_column">
                  </div> */}
                </div>
              </div>
              {/* Header End */}
              {/* Main Table */}
              {project.tasks.map(task => (
                <div key={task.id} className="task_container">
                  <div className="task_colour" style={{ background: '#6ECAB5' }}></div>
                  <div className="task_content_container">
                    {task.id === this.state.editTask ? 
                      <input 
                        className="task_text new_task_input" style={{ fontSize: '1em' }}
                        onBlur={() => this.sendTaskEdit(task.id)}
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') return this.sendTaskEdit(task.id)
                        }}
                        autoFocus
                        onChange={this.handleTaskChange}
                        value={this.state.editTaskText}
                      /> :
                      <p 
                        onClick={() => this.editTaskText(task.id, task.text)}
                        className="task_text"
                      >
                        {task.text}
                        <span 
                          onClick={() => this.taskDelete(task.id)}
                          className="task_delete"></span>
                      </p>
                    }
                    {task.columns.map(column => (
                      <div 
                        key={column.id} 
                        className={`task_column_outer task_column_${column.col_type} task_column_${column[column.col_type]}`}
                        onClick={(event) => this.handlePopup(event, column)}
                      >
                        <div className="task_column">
                          {column.col_type === 'users' &&
                        <div 
                          className="user_column_image user_column_padding" 
                          style={{ backgroundImage: `url('${column.users[0] && project.users.find(user => user.id === column.users[0]).image}')` }}>                    
                        </div>
                          }
                          {column.col_type === 'numbers' && column[column.col_type]}
                          {column.col_type === 'text' && column[column.col_type]}
                          {column.col_type === 'priority' && column[column.col_type]}
                          {column.col_type === 'status' && column[column.col_type]}
                          {column.col_type === 'date' && column[column.col_type]}
                          {column.col_type === 'file' && column[column.col_type] && <div className={`column_file_icon pointer_events_none column_file_${column[column.col_type].split('.').pop()}`}></div>}
                        </div>
                      </div>
                    ))}
                    {/* New Column */}
                    {/* <div className="new_task_column">

                  </div> */}
                    {/* New Column End */}
                  </div>
                </div>
              ))}
              {/* Main Table End */}
              <div 
                className="task_container new_task_container"
                onClick={this.newRowTextField}
              >
                <div className="task_colour" style={{ background: '#6ECAB5' }}></div>
                <div className="task_content_container">
                  {this.state.newTask ? 
                    <input 
                      className="task_text new_task_input" style={{ fontSize: '1em' }}
                      onBlur={this.newRow}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') return this.newRow(event)
                      }}
                      autoFocus
                    /> :
                    <p className="task_text">+ Task</p>
                  }
                  {/* <p className="task_text">New Task</p> */}
                  {/* {project.tasks.length > 0 && 
                  project.tasks[0].columns.map(column => (
                    <div
                      className="new_task_column"
                    >
                      <div className="new_task_column">
                        </div>
                    </div>
                  ))} */}
                </div>
              </div>
            </div>
            <div className="new_column">
              <div 
                onClick={this.newColumnOpen}
                className="new_column_inner"
              >
              +
              </div>
            </div>
            { this.state.newColumnOpen &&
            // <div className="new_column_popup_outer">
            // <div className="popup_close new_column_close" onClick={this.newColumnOpen}></div>
            <div className="new_column_popup_test">
              <div className="popup_close new_column_close" onClick={this.newColumnOpen}></div>
              <div className="new_column_popup_inner">
                <div 
                  name="status"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Status</h2>
                </div>
                <div 
                  name="numbers"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Numbers</h2>
                </div>
                <div 
                  name="priority"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Priority</h2>
                </div>
                <div 
                  name="users"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Users</h2>
                </div>
                <div 
                  name="text"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Text</h2>
                </div>
                <div 
                  name="date"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">Date</h2>
                </div>
                <div 
                  name="file"
                  onClick={this.newColumn}
                  className="new_column_item">
                  <h2 className="new_column_item_text">File</h2>
                </div>
                {/* </div> */}
              </div>
            </div>
            }
          </div>
        </div>
        { this.state.modal.open &&
          <UserSearchModal 
            handleModal={this.handleModal}
            handleSearchChange={this.handleSearchChange}
            userSearch={this.state.userSearch}
            users={this.state.users}
            selectUser={this.selectUser}
            usersSelected={this.state.usersSelected}
          />
        }
        {
          this.state.chatModal &&
          <ChatModal 
            toggleChatModal={this.toggleChatModal}
            project={this.state.project}
            user={this.props.user}
          />
        }
      </section>
    )
  }
}

export default ProjectMain