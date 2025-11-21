

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
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Make the textarea out of viewport
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    
    // Add to DOM
    document.body.appendChild(textarea);
    
    // Select the text
    textarea.select();
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showMessage();
            }).catch(() => {
                fallbackCopy(textarea);
                showMessage();
            });
        } else {
            // Fallback for older browsers
            fallbackCopy(textarea);
            showMessage();
        }
    } catch (err) {
        // Final fallback
        fallbackCopy(textarea);
        showMessage();
    } finally {
        // Clean up
        document.body.removeChild(textarea);
    }
    
    function fallbackCopy(element) {
        try {
            const range = document.createRange();
            range.selectNode(element);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
    }
    
    function showMessage() {
        if (message) {
            alert(message);
        }
    }
};
