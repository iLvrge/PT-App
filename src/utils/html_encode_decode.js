

function escapeCharEntities() {
    var map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&apos;"
    };
    return map
}

var mapkeys = '', mapvalues = ''

function swapJsonKeyValues ( json ) {
    var count = Object.keys( json ).length;
    var obj = {};
    var keys = '[', val = '(', keysCount = 1;
    for(var key in json) {
        if ( json.hasOwnProperty( key ) ) {
            obj[ json[ key ] ] = key;
            keys += key;
            if( keysCount < count ) {
                val += json[ key ]+'|'
            } else {
                val += json[ key ]
            }
            keysCount++
        }
    }
    keys += ']';    val  += ')'
    mapkeys = keys
    mapvalues = val
    return obj
}


export const html = {
    encodeRex : function () {
        return  new RegExp(mapkeys, 'g') // "[&<>"']"
    }, 
    decodeRex : function () {
        return  new RegExp(mapvalues, 'g'); // "(&amp;|&lt;|&gt;|&quot;|&apos;)"
    },
    encodeMap : JSON.parse( JSON.stringify( escapeCharEntities () ) ), // json = {&: "&amp;", <: "&lt;", >: "&gt;", ": "&quot;", ': "&apos;"}
    decodeMap : JSON.parse( JSON.stringify( swapJsonKeyValues( escapeCharEntities () ) ) ),
    encode : function ( str ) {
        var encodeRexs = html.encodeRex()
        return str.replace(encodeRexs, function(m) { return html.encodeMap[m] }) // m = < " > SpecialChars
    },
    decode : function ( str ) {
        var decodeRexs = html.decodeRex();
        return str.replace(decodeRexs, function(m) { return html.decodeMap[m]; }) // m = &lt; &quot; &gt;
    }
}; 

export const downloadFile = (data) => {
    const blob = new Blob([data], {type: 'text/plain'}), url = window.URL.createObjectURL(blob), link = document.createElement("a")
    link.download = 'uspto.xml'
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url)
}

export const checkFileContent = async(url) => {
    const response = await fetch(url)
    return await response.text()    
}

export const copyToClipboard = (text, message) => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
            .then(() => {
                alert(message);
            })
            .catch(() => {
                fallbackCopy(text);
                alert(message);
            });
        } else {
            fallbackCopy(text);
        }
    } catch (err) {
        // Safari throws here BEFORE reaching .catch()
        fallbackCopy(text);
        alert(message);
    }
};

const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");

    document.body.removeChild(textarea);
};
