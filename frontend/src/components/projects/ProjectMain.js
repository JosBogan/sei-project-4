import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

import StatusPicker from './popups/StatusPicker'
import plus from '../../assets/plus.svg'
import plusRed from '../../assets/plus_red.svg'

class ProjectMain extends React.Component {

  state = {
    project: null,
    popup: {
      open: false,
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
    newColumnOpen: false
  }

  async componentDidMount() {
    this.getProjectData()
  }

  getProjectData = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${this.props.match.params.id}`, {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
      data.tasks.forEach(task => {
        task.columns.sort((a,b) => a.id - b.id)
      })
      data.tasks.sort((a, b) => a.id - b.id)
      this.setState({ 
        project: data, 
        newTask: false, 
        edit: { ...this.state.edit, newName: data.name, newDescription: data.description },
        editTask: null,
        editTaskText: ''
        })
    } catch(err) {
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
    const popup = {...this.state.popup, open: !this.state.popup.open, location: { ...this.state.popup.location, top, left }}
    console.log(column.col_id, column.id)
    this.setState({ popup, column, newColumnOpen: false })
  }

  handleSetColumn = async (event) => {
    const dataName = event.target.getAttribute('data-name')
    this.closePopUp()
    console.log(this.state.column.col_id, this.state.column.id)
    try {
      const res = await axios.put(`/api/projects/${this.state.project.id}/columns/${this.state.column.col_id}/${this.state.column.id}/`,
      { status: dataName }, {
        headers: {
          Authorization: `Bearer ${Auth.getToken()}`
        }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  taskDelete = async (taskId) => {
    console.log(taskId)
    try {
      const res = await axios.delete(`/api/projects/${this.state.project.id}/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  columnDelete = async (colId) => {
    console.log(colId)
    try {
      const res = await axios.delete(`/api/projects/${this.state.project.id}/columns/${colId}/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err)
    }
  }

  newRowTextField = () => {
    this.setState({ newTask: true })
  }

  newRow = async (event) => {
    if (!event.target.value) return this.setState({ newTask: false })
    try {
      const res = await axios.post(`/api/projects/${this.state.project.id}/tasks/`, {
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
      const res = await axios.post(`/api/projects/${this.state.project.id}/columns/`, { col_type: type }, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch(err) {
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
      const res = await axios.put(`/api/projects/${this.state.project.id}/`, request, {
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
      const res = await axios.put(`/api/projects/${this.state.project.id}/tasks/${taskId}/`, { text: this.state.editTaskText }, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      this.getProjectData()
    } catch (err) {
      console.log(err.response)
    }
  }

  closePopUp = () => {
    const popup = {...this.state.popup, open: false, location: { ...this.state.popup.location}}
    this.setState({ popup })
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.getProjectData()
    }
  }

  render() {
    if (!this.state.project) return null
    const { project } = this.state
    const { popup } = this.state
    return (
      <section className="project_main">
        { popup.open && 
          <div className="popup_wrapper">
            <div className="column_popup" style={{ top: `${popup.location.top}px`, left: `${popup.location.left}px` }}>
              <StatusPicker closePopUp={this.closePopUp} handleSetColumn={this.handleSetColumn}/>
            </div>
          </div>
        }
        <div className="project_container">
          <div className="project_header">
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
                value={this.state.edit.newDescription}
              />
            }
          </div>
          <div className="project_line_break"></div>
          <div className="table_container_outer">
          <div className="table_container">
            {/*  Header */}
            <div className="task_container col_header_container">
                <div className="task_colour col_header_invis" style={{ background: '#6ECAB5' }}></div>
                <div className="task_content_container">
                  <p className="task_text col_header_invis"></p>
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
                    onKeyPress={(event) => {if (event.key === "Enter") return this.sendTaskEdit(task.id)}}
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
                      className={`task_column_outer task_${column[column.col_type]}`}
                      onClick={(event) => this.handlePopup(event, column)}
                    >
                      <div className="task_column">
                        {column[column.col_type]}
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
                    onKeyPress={(event) => {if (event.key === "Enter") return this.newRow(event)}}
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
              <div className="new_column_popup">
                <div className="popup_close new_column_close" onClick={this.newColumnOpen}></div>
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
              </div>
              }
          </div>
        </div>
      </section>
    )
  }
}

export default ProjectMain