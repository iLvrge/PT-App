export const updateHashLocation = ( location, findString, selectedData ) => {
    let { hash } = location
    hash = hash.replace('#', '')
    let explodeHash = hash.split('&')
    if(hash.indexOf(findString) >= 0) {
        explodeHash  = explodeHash.filter( param =>  param.indexOf(findString) < 0)
    }
    explodeHash.push(`${findString}=${JSON.stringify(selectedData)}`)
    return explodeHash
}


export const warnConsole = (message) => {
    const originalWarn = console.warn;

    console.warn = function (...args) {
        const arg = args && args[0]
        console.log('arg', arg)
        if (arg && arg.includes(message)) return;
        originalWarn(...args);
    };
}