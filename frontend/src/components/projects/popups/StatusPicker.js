import React from 'react'

class StatusPicker extends React.Component{
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_done"
          data-type="status"
          data-value="done"
        >Done</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_progress"
          data-type="status"
          data-value="in progress"
        >In Progress</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_stuck"
          data-type="status"
          data-value="stuck"
        >Stuck</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_blank"
          data-type="status"
          data-value=""
        ></div>
      </div>
    )
  }
}

export default StatusPicker