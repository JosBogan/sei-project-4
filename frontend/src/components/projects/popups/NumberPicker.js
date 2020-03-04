import React from 'react'

class NumberPicker extends React.Component{
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <input 
          data-type="numbers"
          type="number"
          autoFocus
          className="input"
          onBlur={(event) => this.props.handleSetColumn(event)}
          onKeyPress={(event) => {if (event.key === "Enter") return this.props.handleSetColumn(event)}}
        />
      </div>
    )
  }
}

export default NumberPicker