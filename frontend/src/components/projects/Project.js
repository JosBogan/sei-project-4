import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ProjectMain from './ProjectMain'
import NewProject from './NewProject'
import User from './User'
import NotFound from '../common/NotFound'

import { Switch, Route } from 'react-router-dom'

class Project extends React.Component {

  state = {
    data: null,
    new: false,
    project: null
  }

  handleNewProject = () => {
    this.setState({ new: true })
  }

  getUserData = async () => {
    const { data } = await axios.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`
      }
    })
    this.setState({ data })
  }

  componentDidMount() {
    this.getUserData()
  }

  render() {
    if (!this.state.data) return null
    const { projects } = this.state.data
    return (
      <section className="project_page_wrapper">
        <div className="navbar_wrapper">
          <Navbar image={this.state.data.image}/>
        </div>
        <div className="main_content_wrapper">
          <div className="sidebar_wrapper">
            <Sidebar 
              projects={projects} 
              handleNewProject={this.handleNewProject}
            />
          </div>
          <div className="project_main_wrapper">
          <Switch>
            <Route path="/project-board/new" render={(props) => <NewProject {...props} getUserData={this.getUserData}/>}/>
            <Route path="/project-board/user" component={User}/>
            {/* <Route path="/project-board/new" component={NewProject}/> */}
            <Route path="/project-board/:id" render={(props) => <ProjectMain {...props} getUserData={this.getUserData}/>}/>
            {/* <Route path="/project-board/:id" component={ProjectMain}/> */}
            {/* { this.state.new ?
              <NewProject /> :
              <ProjectMain />
            } */}
          </Switch>
          </div>
        </div>
      </section>
    )
  }
}

export default Project