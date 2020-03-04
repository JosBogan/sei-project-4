import React from 'react'

class FilePicker extends React.Component{
  render() {
    const { column } = this.props
    return (
      <div className="picker">
        <div className="popup_close" onClick={this.props.closePopUp}></div>
        <input 
          data-type="file"
          className="input"
          type="file"
          autoFocus
          onChange={this.props.handleFileUpload}
        />
        {column.file && <a className="column_file_link" rel="noopener noreferrer" target="_blank" href={column.file}><div className={`column_file_icon pointer_events_none column_file_${column[column.col_type].split('.').pop()}`}></div></a>}
      </div>
    )
  }
}

export default FilePicker