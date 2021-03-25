import React from 'react'
import useStyles from './styles'
import { setCurrentWidget } from '../../../actions/patenTrackActions'
import { connect } from 'react-redux'

function FullWidthSwitcher(props) {
  const classes = useStyles()
  const isExpanded = props.currentWidget === props.widget

  return (
    <div>
      {
        props.show
        ?
          <div
            className     = {classes.switcher}
            onClick       = {() => {
              props.setCurrentWidget(props.widget)
            }}
          >
            <img src={ isExpanded ? '/assets/images/inward_icon.svg' : '/assets/images/upward_icon.svg'} alt={''}/>
          </div>
        :
          ''
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentWidget: state.patenTrack.currentWidget
  }
}

const mapDispatchToProps = {
  setCurrentWidget
}


export default connect(mapStateToProps, mapDispatchToProps)(FullWidthSwitcher)