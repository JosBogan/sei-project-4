import React from 'react'

import axios from 'axios'
import Auth from '../../lib/auth'

class ChatModal extends React.Component {

  state = {
    comments: [],
    newComment: ''
  }

  getComments = async () => {
    try{
      const { data } = await axios.get(`/api/projects/${this.props.project.id}/comments/`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      data.sort((a, b) => a.id - b.id)
      console.log(data)
      this.setState({ comments: data, newComment: '' })
    } catch (err) {
      console.log(err.response)
    }
  }

  async componentDidMount() {
    this.getComments()
  }

  sendComment = async (event) => {
    event.preventDefault()
    console.log(this.props.project)
    const data = { text: event.target.value }
    try {
      if (event.target.value !== '') {
        await axios.post(`/api/projects/${this.props.project.id}/comments/`, data, {
          headers: { Authorization: `Bearer ${Auth.getToken()}` }
        })
        this.getComments()
      }
    } catch (err) {
      console.log(err.response)
    }
  }

  handleChange = (event) => {
    this.setState({ newComment: event.target.value })
  }

  render() {
    const { project } = this.props
    return (
      <>
        <div 
          className="modal"
          onClick={this.props.toggleChatModal}
        >
        </div>
        <section className="modal_content_wrapper project_chat_outer_wrapper">
          <div className="project_chat_wrapper">
          <h2 className="project_chat_header">{project.name}</h2>
          <div className="project_line_break"></div>
          <div>
            <div>
              {this.state.comments.map(comment => (
              <div 
                key={comment.id} 
                className={`comment_wrapper ${!Auth.isOwner(comment.user.id) && 'comment_not_owned'}`}
              ><div className="user_comment_image user_search_image" style={{ backgroundImage: `url('${comment.user.image}')` }}></div>
              <div className={`comment_text_field ${Auth.isOwner(comment.user.id) && 'comment_owned'}`}>
                <h4>{Auth.isOwner(comment.user.id) ? 'Me' : comment.user.username}</h4>
                <div className="chat_line_break"></div>
                <p>{comment.text}</p>
              </div>
              </div>
              ))}
            </div>
            <div>
              <form onSubmit={this.sendComment}>
                <div className="new_comment_wrapper">
                  <div className="user_comment_image user_search_image" style={{ backgroundImage: `url(${this.props.user.image})` }}></div>
                  <textarea 
                    onKeyPress={(event) => {if (event.key === 'Enter') return this.sendComment(event)}}
                    onBlur={this.sendComment}
                    onChange={this.handleChange}
                    value={this.state.newComment}
                    className="new_comment_text_field"
                  />
                </div>
              </form>
            </div>
          </div>
          </div>
        </section>
        </>
    )
  }
}

export default ChatModal