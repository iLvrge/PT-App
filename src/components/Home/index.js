import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { controlList } from '../../utils/controlList'

const Home = ({click, closeModal}) => {

    // handle for ouside click on Menubar
    const handleOutsideClick = (e) => {
      const target = e.target      
      if(target != null){
        const elementCategory = target.closest('div.category')
        if(!target.classList.contains('hexagon-in2') || elementCategory != null){
          //close Modal
          closeModal(e, false)  
        }
      }      
    }
    
    useEffect(() => {
      document.addEventListener('click', handleOutsideClick, false)
      return () => {
        document.removeEventListener('click', handleOutsideClick, false)
      }
    }, [handleOutsideClick]) 
    return(
      <div className='pricing'> 
        <section className='hex-wrapper'>
          <div className='d-inline-flex flex-wrap'>
            {
              controlList.map( (item, index) => (
                <div key={index} className={item.type == 'category' ? 'lab_item text-center category ' + item.class : 'lab_item text-center ' + item.class }>
                  <div className='w-100 h-100 d-block'>
                    <div className='hexagon hexagon2'>
                      <div className='hexagon-in1'>
                        <div className='hexagon-in2'>
                          {
                            item.type == 'category'
                            ?
                              <h4 className={`mt-sm-0 ${item.mainHeadingClass}`}>{item.name}</h4>
                            :
                            <Link to={item.redirect} className={item.mainHeadingClass} onClick={(e) => {click(e, item)}}>
                              {
                                item.showSvg === true
                                ?
                                  <span dangerouslySetInnerHTML={{
                                    __html: item.svg
                                  }}></span>
                                :
                                  <img src={item.image}/>
                              }
                              <h4 className='mt-sm-0'>{item.mainHeading}</h4>
                              <p className='font-16 font-weight-bold'>{item.subHeading}</p>
                            </Link>
                          }                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }            
          </div>
        </section>
      </div> 
    )  
}
export default Home