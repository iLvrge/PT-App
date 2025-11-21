

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
    // Safari-specific fix: Use a more reliable method
    let successful = false;
    
    try {
        // Create input element instead of textarea for better Safari compatibility
        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        
        // Style to hide it - use display none for Safari
        input.style.position = 'fixed';
        input.style.top = '-9999px';
        input.style.left = '-9999px';
        input.style.opacity = '0';
        input.style.pointerEvents = 'none';
        
        document.body.appendChild(input);
        
        // Select all text
        input.select();
        input.setSelectionRange(0, text.length);
        
        // Try to copy
        successful = document.execCommand('copy');
        
        // Remove the input
        document.body.removeChild(input);
        
        if (successful) {
            if (message) alert(message);
        } else {
            console.warn('execCommand copy returned false, trying clipboard API');
            tryModernClipboard(text, message);
        }
    } catch (err) {
        console.error('execCommand copy failed:', err);
        tryModernClipboard(text, message);
    }
    
    function tryModernClipboard(text, message) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (message) alert(message);
            }).catch((err) => {
                console.error('Clipboard API also failed:', err);
                // Open in new tab as fallback
                openInNewTab(text);
            });
        } else {
            // Clipboard API not available, open in new tab
            openInNewTab(text);
        }
    }
    
    function openInNewTab(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
};
