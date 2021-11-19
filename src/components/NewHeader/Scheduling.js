import React from 'react'
import {Helmet} from "react-helmet";

const Scheduling = () => {
    return(
        <React.Fragment>
            <div tabIndex="0" data-test="sentinelStart"></div>
            <div className='meeting-popup'>
            <div className="meetings-iframe-container" data-src="https://meetings.hubspot.com/uzi?embed=true"></div>
                <Helmet>
                    <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
                </Helmet>            
            </div>
            <div tabIndex="0" data-test="sentinelEnd"></div> 
        </React.Fragment>
    )
}


export default Scheduling;