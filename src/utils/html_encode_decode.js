

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
    // Try modern Clipboard API first (works in Chrome)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (message) alert(message);
        }).catch((err) => {
            console.error('Clipboard API failed:', err);
            // Fall back to execCommand for Safari
            execCommandCopy(text, message);
        });
        return;
    }
    
    // Fallback to execCommand for older browsers and Safari
    execCommandCopy(text, message);
    
    function execCommandCopy(text, message) {
        try {
            // Create a textarea element
            const textarea = document.createElement('textarea');
            textarea.value = text;
            
            // Make it visible but off-screen (Safari needs visible elements)
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '1';
            textarea.style.pointerEvents = 'none';
            textarea.style.zIndex = '-1';
            
            document.body.appendChild(textarea);
            
            // Focus the textarea
            textarea.focus();
            
            // Select all the text
            textarea.select();
            
            // Copy the selected text
            const successful = document.execCommand('copy');
            
            // Remove the textarea
            document.body.removeChild(textarea);
            
            if (successful) {
                if (message) alert(message);
            } else {
                console.warn('execCommand copy returned false');
                showFallbackModal(text);
            }
        } catch (err) {
            console.error('execCommand copy failed:', err);
            showFallbackModal(text);
        }
    }
    
    function showFallbackModal(text) {
        openInNewTab(text);
    }
    
    function openInNewTab(text) {
        try {
            // Create a temporary textarea to show the text
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'white';
            modal.style.padding = '20px';
            modal.style.borderRadius = '8px';
            modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            modal.style.zIndex = '10000';
            modal.style.maxWidth = '500px';
            modal.style.maxHeight = '400px';
            modal.style.overflow = 'auto';
            
            const title = document.createElement('p');
            title.textContent = 'Copy failed. Please copy the text below:';
            title.style.marginTop = '0';
            title.style.marginBottom = '10px';
            title.style.fontWeight = 'bold';
            
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            textarea.style.padding = '10px';
            textarea.style.border = '1px solid #ccc';
            textarea.style.borderRadius = '4px';
            textarea.style.fontFamily = 'monospace';
            textarea.style.fontSize = '12px';
            textarea.style.marginBottom = '10px';
            textarea.readOnly = true;
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.padding = '8px 16px';
            closeBtn.style.backgroundColor = '#007bff';
            closeBtn.style.color = 'white';
            closeBtn.style.border = 'none';
            closeBtn.style.borderRadius = '4px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            };
            
            modal.appendChild(title);
            modal.appendChild(textarea);
            modal.appendChild(closeBtn);
            
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';
            overlay.onclick = () => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            };
            
            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            
            // Auto-select the text
            textarea.select();
        } catch (err) {
            console.error('Failed to show fallback modal:', err);
            // Last resort: show in alert
            alert('Copy failed. Here is your text:\n\n' + text);
        }
    }
};
