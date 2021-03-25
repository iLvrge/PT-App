import React from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'

class PatentTopTitle extends React.Component {
    
  constructor(props_) {
       
    super(props_)
      
    this.state = { expand: true }
    this.update = this.update.bind(this)
         
  }
    
  update () {
    
    this.setState({ expand: !this.state.expand })

  }
    
  render () {
            
   return (
        
            <div id='topTitle'>{this.props.title}</div>

       )
        
  }
    
}

export default PatentTopTitle