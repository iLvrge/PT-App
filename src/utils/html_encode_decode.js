

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
            // Create a textarea (works better with execCommand in Safari)
            const textarea = document.createElement('textarea');
            textarea.value = text;
            
            // Style to hide it
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            
            document.body.appendChild(textarea);
            
            // Focus and select
            textarea.focus();
            textarea.select();
            
            // Try to copy
            const successful = document.execCommand('copy');
            
            // Remove the textarea
            document.body.removeChild(textarea);
            
            if (successful && message) {
                alert(message);
            } else if (!successful) {
                console.error('Copy command was unsuccessful');
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }
};
