export  const resizePane = (name, size, callBack) => {
    //TO store size to localstorage
    localStorage.setItem(name, size)
    //TODO set the pass size to callback fn
    callBack(size)

    //editorBar()  
}



export const editorBar = (time) => {
    /* setTimeout(() => {
        const findEditor = document.getElementsByClassName('editor')
        if( findEditor != null && findEditor.length > 0 ) {
            findEditor[0].style.width = `${(findEditor[0].parentElement.clientWidth * 95 ) / 100}px`
        } else {
            editorBar()
        }
    }, typeof time == undefined ? 100 : time) */
}

export  const resizePane2 = (size, callBack) => {
    callBack(size)
}