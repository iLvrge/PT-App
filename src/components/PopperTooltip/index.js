import React, { useState } from 'react';
import { usePopper } from 'react-popper';


const virtualReference = {
    getBoundingClientRect() {
        return {
            width: 250,
        };
    },
};

const PopperTooltip = (props) => {
    const [popperElement, setPopperElement] = React.useState(null);
    const { styles, attributes } = usePopper(virtualReference, popperElement);

    return (
        <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
            {props.tooltip}
        </div>
    );
}



export default PopperTooltip;