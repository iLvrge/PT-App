import React from 'react'
import CustomListItem from './CustomListItem'
import useStyle from './styles'

function CustomList(props) {
  const classes = useStyle()

  return (
    <ul className={classes.list}>
      {
        props.data && props.data.length
        ?
          props.data.map((item, index) => (
            <CustomListItem
              key     = {index}
              depth   = {props.depth}
              tabId   = {props.tabId}
              parent  = {props.parent}
              {...item}
            />
          ))
        :
          ''
      }
    </ul>
  )
}

export default CustomList