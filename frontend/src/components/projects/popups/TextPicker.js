import React from 'react'

class TextPicker extends React.Component{
  render() {
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <input 
          data-type="text"
          autoFocus
          className="input"
          maxLength="10"
          onBlur={(event) => this.props.handleSetColumn(event)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') return this.props.handleSetColumn(event)
          }}
        />
      </div>
    )
  }
}

export default TextPicker