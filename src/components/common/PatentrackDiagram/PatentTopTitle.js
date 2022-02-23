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
import { Tooltip, Typography, Zoom, Drawer, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox, Divider, IconButton, Badge, Paper } from "@material-ui/core";
import Draggable from "react-draggable"
import { Fullscreen, Close } from '@material-ui/icons'
import { FaLightbulb } from "react-icons/fa";
import * as d3 from 'd3'
import clsx from 'clsx';

class PatentTopTitle extends React.Component {
    
  constructor(props_) {
       
    super(props_)
    this.config = props_.config;  
    this.state = { expand: true,  right: false, anchorEl: null, sliderValue: 50, x: '-85px', y: '35px'}
    this.update = this.update.bind(this)
  }
    
  update () {    
    this.setState({ expand: !this.state.expand })
  }

  toggleDrawer = (event, open) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift') ) {
      return;
    }
    this.setState({
      anchorEl: open === true ? event.currentTarget : null
    }) 
  }

  handleSliderChange = (event, newValue) => {
    this.setState({
      sliderValue: newValue
    })
    this.props.changeParentWidth(newValue)
  }

  handleDragStop = (e, position) => {
    const {x, y} = position;
    this.setState({x,y})
  }
  
  render () {
    const { anchorEl, sliderValue, x, y } = this.state;
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
          className={clsx(`listIconItem checkboxItems ${i_< 7 ? 'floatItem' : ''}`)}
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
            <div id='topTitle' style={{backgroundColor: this.config.title.background, border: `1px solid ${this.config.title.border}`, boxShadow: `0 0px 5px 0 ${this.config.title.boxShadow}`, color: this.config.title.color}}>
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
            <Draggable 
              handle="#draggable-illustration-menu-item" 
              cancel={'[class*="zoom_slider"]'}
              onStop={this.handleDragStop}
            > 
              <Menu
                id='draggable-illustration-menu-item'
                open={open}
                anchorEl={anchorEl}
                onClose={(event) => {this.toggleDrawer(event, false)}}              
                disableAutoFocusItem
                PaperProps={{    
                  style: {
                    width: 250,  
                    left: '50%',
                    transform: `translateX(${x}) translateY(${y})`,
                    backgroundColor: 'rgba(66,66,66, 0.7)'   
                  }
                }}
              >
                <MenuItem className={`listIconItem illustration_menu_close_btn`}>
                  <ListItemIcon onClick={(event) => {this.toggleDrawer(event, false)}}>
                    <Close/>
                  </ListItemIcon>
                </MenuItem>
                <MenuItem className={`listIconItem`} style={{marginTop: 8}}>
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
                  <MenuItem> 
                    <ListItemIcon className={'zoom_container'}>
                      <Slider className={'zoom_slider'} value={sliderValue} onChange={this.handleSliderChange} aria-labelledby="continuous-slider" />
                    </ListItemIcon>
                    <ListItemText className={'show_label'}>Zoom</ListItemText>    
                  </MenuItem>    
                <Divider />  
                <MenuItem className={`listIconItem heading`}>
                  <ListItemText>Filter Transaction Types</ListItemText>    
                </MenuItem>    
                {filters}
              </Menu>     
            </Draggable> 
          </React.Fragment>
       )
        
  }
    
}
export default PatentTopTitle;