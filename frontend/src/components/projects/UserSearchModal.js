import React from 'react'

class UserSearchModal extends React.Component {

  render() {
    // if (!this.props.userSearch) return null
    return (
      <>
        <div 
          className="modal"
          onClick={this.props.handleModal}
        >
        </div>
        <div className="modal_content_wrapper">
            <div className="modal_content">
              <h2 className="modal_header">Users</h2>
            <input 
              className="input modal_input"
              placeholder="Enter Name"
              onChange={this.props.handleSearchChange}
              value={this.props.userSearch}
            />
            <div>
              {this.props.users && 
              this.props.users.filter(user => (
                user.username.toLowerCase().includes(this.props.userSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(this.props.userSearch.toLowerCase())
                )).map(user => (
                <div
                  key={user.id}
                  onClick={() => this.props.selectUser(user)}
                  className="user_search_container"
                >
                  <div className="user_search_image" style={{ backgroundImage: `url(${user.image})` }}></div>
                  <div className="user_search_header">
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                  </div>
                  { this.props.usersSelected.map(user => user.id).includes(user.id) &&
                  <div className="user_search_controls">
                    <div className="user_selected_icon"></div>
                    {/* <div className="user_delete_icon"></div> */}
                  </div>
                  }
                </div>
              ))}
            </div>
            </div>
          </div>
        </>
    )
  }

}

export default UserSearchModal