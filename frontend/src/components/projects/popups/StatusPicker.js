import React from 'react'

class StatusPicker extends React.Component{
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_done"
          data-name="done"
        >Done</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_progress"
          data-name="in progress"
        >In Progress</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_stuck"
          data-name="stuck"
        >Stuck</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_blank"
          data-name=""
        ></div>
      </div>
    )
  }
}

export default StatusPicker