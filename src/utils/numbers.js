export const numberWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const addCommas = (nStr) => {
    nStr += ''
    var x = nStr.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
    }
    return x1 + x2
}

export const applicationFormat = (x) => {
    return x != undefined ? x.toString().substr(0,2) +'/'+ x.toString().substr(2, x.toString().length - 1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

export const capitalizeEachWord = (sentence) => {
    /*return sentence != undefined ? sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) : ''*/
    /*return sentence != undefined ? sentence.toLowerCase().replace( /\b.([^of])/g, function(a){ return a.toUpperCase()}) : ''*/
    return sentence != undefined ? sentence.toLowerCase().replace( /\b.([^of])/g, function(a){ return a.toUpperCase()}).charAt(0) + sentence.charAt(1).toLocaleLowerCase() + sentence.slice(2) : ''
}
