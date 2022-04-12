import React from "react"
import { Grid } from "@mui/material"

const BlankLayout = (props) => {   
    const childrenWithProps = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {...props}) 
        }
        return child
    })

    return (
        <Grid container >
            {
                childrenWithProps
            }
        </Grid>
    )

}



export default BlankLayout