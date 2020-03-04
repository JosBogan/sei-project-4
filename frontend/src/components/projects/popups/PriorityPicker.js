import React from 'react'

class StatusPicker extends React.Component{
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_urgent"
          data-type="priority"
          data-value="urgent"
        >Urgent</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_high"
          data-type="priority"
          data-value="high"
        >High</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_medium"
          data-type="priority"
          data-value="medium"
        >Medium</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_low"
          data-type="priority"
          data-value="low"
        >Low</div>
        <div 
          onClick={(event) => this.props.handleSetColumn(event)}
          className="picker_option picker_blank"
          data-type="priority"
          data-value=""
        ></div>
      </div>
    )
  }
}

export default StatusPicker