import React from 'react'
import ReactDOM from 'react-dom'
import Slider from '@material-ui/core/Slider'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt, 
  faEllipsisV,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faFastBackward,
  faFastForward,
  faCheckSquare,
  faSquare,
  faExpand
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Typography, Zoom, Drawer, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox, Divider, IconButton, Badge } from "@material-ui/core";
import { Fullscreen } from '@material-ui/icons'
import { FaLightbulb } from "react-icons/fa";
import * as d3 from 'd3'
import clsx from 'clsx';

class PatentTopTitle extends React.Component {
    
  constructor(props_) {
       
    super(props_)
      
    this.state = { expand: true,  right: false, anchorEl: null, sliderValue: 30}
    this.update = this.update.bind(this)
  }
    
  update () {    
    this.setState({ expand: !this.state.expand })
  }

  toggleDrawer = (event, open) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') ) {
      return;
    }
    console.log(event.currentTarget)
    this.setState({
      anchorEl: open === true ? event.currentTarget : null
    }) 
  }

  handleSliderChange = (event, newValue) => {
    this.setState({
      sliderValue: newValue
    })
  }
  
  render () {
    const { anchorEl, sliderValue } = this.state;
    const open = Boolean(anchorEl);
    
    let showFilters = this.state.filters
      ? {
          display: "inline-block",
          transform: "translate(0%, -55%)",
        }
      : { display: "none" };

    let filters = Object.keys(this.props.colorScheme).map((category_, i_) => {
      let filterElement = (
        category_.charAt(0).toUpperCase() + category_.slice(1)
      )
        .replace(/([A-Z])/g, " $1")
        .trim();
      let hex = this.props.colorScheme[category_];

      return (
        <MenuItem
          key={"PatentrackDiagramFilterElement_" + i_}
          className={clsx(`listIconItem checkboxItems `)}
        >
          <ListItemIcon className={'checkbox'}>
            <Checkbox
              defaultChecked={true}
              id={filterElement}
              onChange={this.props.update}
            />
          </ListItemIcon>
          <ListItemText style={{ color: hex }}>{filterElement}</ListItemText>
        </MenuItem>
      );
    });
    
    
   return (
          <React.Fragment>
            <div id='topTitle'>
              <span className={'title'} title={this.props.title}>{this.props.title}</span>
              <div id="topUIToolbarExpanded">
                <IconButton
                  onClick={(event) => {this.toggleDrawer(event, true)}}
                >
                  <Tooltip 
                      className='tooltip'
                      title={
                        <Typography color="inherit" variant='body2'>{'Toolbar'}</Typography>
                      }
                      placement='top'
                      enterDelay={0}
                      TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                      > 
                      <Badge badgeContent={0} color="secondary"> 
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                        />
                      </Badge>   
                  </Tooltip>                     
                </IconButton>     
                <IconButton
                  onClick={() => this.props.toggleShow3rdParities(!this.props.showThirdParties)}
                >
                  <Tooltip 
                      className='tooltip'
                      title={
                        <Typography color="inherit" variant='body2'>{'Show/Hide 3rd Parties'}</Typography>
                      }
                      placement='top'
                      enterDelay={0}
                      TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                      > 
                      <Badge badgeContent={0} color="secondary"> 
                        <FontAwesomeIcon
                          icon={this.props.showThirdParties ? faCheckSquare : faSquare}
                        />
                      </Badge>   
                  </Tooltip>                     
                </IconButton> 
                <IconButton
                  onClick={() => this.props.uspto(!this.props.usptoMode)}
                  /* className={'uspto_logo'} */
                >
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'USPTO'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <Badge badgeContent={0} color="secondary">   
                      <FaLightbulb
                        className={this.props.usptoMode === true ? 'active' : '' }
                      />
                      {/* <span className={'uspto_logo_container'}><img src={'/assets/images/logo-micro.png'}/></span> */}
                    </Badge>
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={() => this.props.share(this.props.patent)}
                >
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Share a diagram'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <Badge badgeContent={0} color="secondary"> 
                      <FontAwesomeIcon
                        icon={faShareAlt}                          
                      />
                    </Badge>
                  </Tooltip>
                </IconButton>
                {
                  !this.props.isFullscreenOpen 
                  ?
                    <IconButton
                      onClick={() => this.props.fullScreen()}
                    >
                      <Tooltip 
                      className='tooltip'
                      title={
                        <Typography color="inherit" variant='body2'>{'Full Screen'}</Typography>
                      }
                      placement='top'
                      enterDelay={0}
                      TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                      >
                        <Badge badgeContent={0} color="secondary"> 
                          <FontAwesomeIcon
                            icon={faExpand}                          
                          />
                        </Badge>
                      </Tooltip>
                    </IconButton>
                  :
                  <IconButton className={'empty'}>&nbsp;</IconButton>
                }                
              </div>              
            </div>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={(event) => {this.toggleDrawer(event, false)}}              
              disableAutoFocusItem
              PaperProps={{    
                style: {
                  width: 250,  
                  left: '50%',
                  transform: 'translateX(-29%) translateY(11%)',
                }
              }}
            >
              <MenuItem className={`listIconItem`}>
                <ListItemIcon id="fastBackward">
                  <FontAwesomeIcon
                    icon={faFastBackward}
                    onClick={this.props.update}
                  />
                </ListItemIcon>
                <ListItemText className={'show_counters custom-width'}>
                  <span style={{visibility: 'hidden'}}></span>
                </ListItemText>
                <ListItemIcon id="fastForward">
                  <FontAwesomeIcon
                    icon={faFastForward}
                    onClick={this.props.update}
                  />
                </ListItemIcon>
                <ListItemText className={'show_label'}>Start / End</ListItemText>
              </MenuItem>
              <MenuItem className={`listIconItem`}>
                <ListItemIcon id="prevAssignment">
                  <FontAwesomeIcon
                    icon={faAngleDoubleLeft}
                    onClick={this.props.update}
                  />
                </ListItemIcon>
                <ListItemText id="assignmentQuantative"  className={'show_counters'}>
                  {this.props.quantatives.assignment.current} /{" "}
                  {this.props.quantatives.assignment.total}
                </ListItemText>
                <ListItemIcon id="nextAssignment">
                  <FontAwesomeIcon
                    icon={faAngleDoubleRight}
                    onClick={this.props.update}
                  />
                </ListItemIcon>   
                <ListItemText className={'show_label'}>Transactions</ListItemText>             
              </MenuItem>
              <MenuItem className={`listIconItem`}>
                <ListItemIcon id="prevAssignee">
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    onClick={this.props.update}
                  />
                </ListItemIcon>
                <ListItemText id="assigneeQuantative"  className={'show_counters'}>
                  {this.props.quantatives.assignee.current} /{" "}
                  {this.props.quantatives.assignee.total}
                </ListItemText>
                <ListItemIcon id="nextAssignee">
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    onClick={this.props.update}
                  />
                </ListItemIcon>   
                <ListItemText className={'show_label'}>Right Steps</ListItemText>             
              </MenuItem>       
              <Divider />  
                <Slider value={sliderValue} onChange={this.handleSliderChange} aria-labelledby="continuous-slider" />
              <Divider />  
              <MenuItem className={`listIconItem heading`}>
                <ListItemText>Filter Transaction Types</ListItemText>    
              </MenuItem>    
              {filters}
            </Menu>      
          </React.Fragment>
       )
        
  }
    
}
export default PatentTopTitle;