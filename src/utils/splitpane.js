export  const resizePane = (name, size, callBack) => {
    //TO store size to localstorage
    localStorage.setItem(name, size)
    //TODO set the pass size to callback fn
    callBack(size)
}


export  const resizePane2 = (size, callBack) => {
    callBack(size)
}