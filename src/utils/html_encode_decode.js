

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
    let success = false;
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (message) alert(message);
            }).catch(() => {
                // Fall back to execCommand if clipboard API fails
                execCommandCopy(text, message);
            });
            return;
        }
    } catch (err) {
        // Continue to fallback
    }
    
    // Fallback for older browsers or if clipboard API not available
    execCommandCopy(text, message);
    
    function execCommandCopy(text, message) {
        try {
            // Create a span element (more reliable than textarea in Safari)
            const span = document.createElement('span');
            span.textContent = text;
            span.style.position = 'fixed';
            span.style.top = '0';
            span.style.clip = 'rect(0, 0, 0, 0)';
            span.style.whiteSpace = 'pre';
            span.style.webkitUserSelect = 'text';
            span.style.userSelect = 'text';
            
            document.body.appendChild(span);
            
            const range = document.createRange();
            const selection = window.getSelection();
            
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
            
            success = document.execCommand('copy');
            
            selection.removeAllRanges();
            document.body.removeChild(span);
            
            if (success && message) {
                alert(message);
            } else if (!success) {
                console.error('Copy command was unsuccessful');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }
};
