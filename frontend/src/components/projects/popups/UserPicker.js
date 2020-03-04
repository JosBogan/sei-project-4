import React from 'react'

class UserPicker extends React.Component {

  state = {
    userSearch: '',
    filteredUsers: []
  }

  handleChange = (event) => {
    const users = JSON.parse(JSON.stringify(this.props.users))
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(event.target.value.toLowerCase()))
    this.setState({ filteredUsers })
  }

  componentDidMount() {
    this.setState({ users: this.props.users, filteredUsers: this.props.users })
  }

  render() {
    return (
      <div className="picker user_picker_wrapper">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <input 
          className="input"
          placeholder="Name"
          onChange={this.handleChange}
        />
        {this.state.filteredUsers.map(user => {
          return (
            <div 
              key={user.id}
              data-type="users"
              data-value={user.id}
              className="user_column_choices_wrapper"
              onClick={(event) => this.props.handleSetUserColumn(event)}
            >
              <div className="user_column_image" style={{ backgroundImage: `url('${user.image}')` }}></div>
              <h4>{user.username}</h4>
            </div>
          )
        })}
      </div>
    )
  }
}

export default UserPicker