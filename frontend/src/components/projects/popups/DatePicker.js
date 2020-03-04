import React from 'react'

class DatePicker extends React.Component {
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        {/* <label htmlFor="date_input">gfds */}
        <input 
          data-type="date"
          type="date"
          id="date_input"
          className="input date_input"
          autoFocus
          // defaultValue="????-??-??"
          onBlur={(event) => this.props.handleSetColumn(event)}
          onChange={(event) => this.props.handleSetColumn(event)}
          onKeyPress={(event) => {if (event.key === "Enter") return this.props.handleSetColumn(event)}}
        />
        {/* </label> */}
    </div>
    )
  }
}

export default DatePicker