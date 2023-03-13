import React from "react";
import Loader from "../Loader";


const SuspenseComponent = (props) => {
    const Child = props.childComponent;
    return (
        <React.Suspense fallback={<Loader />} > 
            <Child {...props}/>
        </React.Suspense>
    )
  };
  
export default SuspenseComponent;