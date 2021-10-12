export const numberWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.toLowerCase().charAt(0).toUpperCase() + s.toLowerCase().slice(1)
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

export const toTitleCase =  (str) => {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
    var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
    var wordSeparators = /([ :–—-])/
  
    return str.toLowerCase().split(wordSeparators)
      .map(function (current, index, array) {
        if (
          /* Check for small words */
          current.search(smallWords) > -1 &&
          /* Skip first and last word */
          index !== 0 &&
          index !== array.length - 1 &&
          /* Ignore title end and subtitle start */
          array[index - 3] !== ':' &&
          array[index + 1] !== ':' &&
          /* Ignore small words that start a hyphenated phrase */
          (array[index + 1] !== '-' ||
            (array[index - 1] === '-' && array[index + 1] === '-'))
        ) {
          return current.toLowerCase()
        }
  
        /* Ignore intentional capitalization */
        if (current.substr(1).search(/[A-Z]|\../) > -1) {
          return current
        }
  
        /* Ignore URLs */
        if (array[index + 1] === ':' && array[index + 2] !== '') {
          return current
        }
  
        /* Capitalize the first letter */
        return current.replace(alphanumericPattern, function (match) {
          return match.toUpperCase()
        })
      })
      .join('')
}