import React from 'react'
import plus from '../../assets/plus.svg'
import plus_white from '../../assets/plus_white.svg'
import { withRouter } from 'react-router-dom'

class Sidebar extends React.Component {

  state = {
    selected: null
  }

  handleNewProject = () => {
    this.props.history.push('/project-board/new')
    this.setState({ selected: 'new' })
  }

  checkCorrectTagSelected = () => {
    const project = this.props.history.location.pathname.replace('/project-board/', '')
    if (this.state.selected !== project) {
      this.setState({ selected: project })
    }
  }

  componentDidUpdate = () => {
    this.checkCorrectTagSelected()
  }

  componentWillMount = () => {
    this.checkCorrectTagSelected()
  }

  handleProjectRedirect = (event) => {
    this.props.history.push(`/project-board/${event.target.getAttribute('name')}`)
    this.setState({ selected: event.target.getAttribute('name') })
  }

  render() {
    console.log(this.state)
    return (
      <section className="sidebar">
        <div className="project_tag_container">
          <div 
            className={`project_tag ${this.state.selected === 'new' ? 'selected_tag' : 'unselected_tag' }`} 
            onClick={this.handleNewProject}>
            <img className="plus" src={this.state.selected === 'new' ? plus : plus_white} alt="New Project"/>
          </div>
          {this.props.projects.map(project => (
            <div className={`project_tag ${parseInt(this.state.selected) === project.id ? 'selected_tag' : 'unselected_tag'}`} 
              key={project.id}
              name={project.id}
              onClick={this.handleProjectRedirect}
            >
              {project.name}
            </div>
          ))}
        </div>
      </section>
    )
  }
}

export default withRouter(Sidebar)