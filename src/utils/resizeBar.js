export const updateResizerBar = (ref, bar, t = 0) => {
    if( ref.current != null ) {
        const container = ref.current.splitPane, 
                findResizer = t === 1 ? container.querySelector('span.Resizer.horizontal')  : container.querySelector('span.Resizer.vertical') 
        let display = 'none'
        if(bar === true){
            display = ''
        }
        findResizer.style.display = display
    }
    
}

export const resetAllRowSelect = ( dispatch,  resetList) => {
    resetList.forEach( item => dispatch( item ))
}