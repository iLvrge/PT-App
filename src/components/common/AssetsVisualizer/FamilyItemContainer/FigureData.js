import React from 'react'

const FigureData = ( { data } ) => {
    return (
        <>
        {
            data != null && data.length > 0 
            ?
                <embed src={data[0]+ '#toolbar=0&amp;navpanes=0&amp;scrollbar=0&quot;'} className='tool_open' type='application/pdf'></embed>
            :
            ''
        }
        </>
    )
}

export default FigureData