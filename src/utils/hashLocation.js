export const updateHashLocation = ( location, findString, selectedData ) => {
    let { hash } = location
    hash = hash.replace('#', '')
    let explodeHash = hash.split('&')
    if(hash.indexOf(findString) >= 0) {
        explodeHash  = explodeHash.filter( param =>  param.indexOf(findString) < 0)
    } 
    explodeHash.push(`${findString}=${Array.isArray(selectedData) ? JSON.stringify(selectedData) : selectedData}`)
    return explodeHash
}


export const warnConsole = (message) => {
    const originalWarn = console.warn;

    console.warn = function (...args) {
        const arg = args && args[0]
        if (arg && arg.includes(message)) return;
        originalWarn(...args);
    };
}

export const getShareLocationCode = () => {
    let codeShare = ''
    if(process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') {
      const locationShare = window.location.pathname
      codeShare = locationShare.split('/').pop()
    }
    return codeShare
}

export const getShareCodeFromLocation = () => {
    return window.location.pathname.split('/').pop();
}