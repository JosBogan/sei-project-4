import React from 'react'
import axios from 'axios'

class Test extends React.Component{


  async componentDidMount() {
    try {
      const response = await axios.get('/api/projects')
      console.log(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div>
        Is it Working?
      </div>
    )
  }
}

export default Test