import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from "react-redux"

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
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Typography, Zoom, Drawer, Menu, MenuItem } from "@material-ui/core";
import { FaLightbulb } from "react-icons/fa";
import { withStyles } from "@material-ui/styles";
import { toggleShow3rdParities } from "../../../actions/uiActions";
import clsx from "clsx";
import * as d3 from 'd3'

class PatentTopTitle extends React.Component {
    
  constructor(props_) {
       
    super(props_)
      
    this.state = { expand: true,  right: false, anchorEl: null}
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
    
  render () {
    const {
      classes,
      usptoMode,
      showThirdParties,
      toggleShow3rdParities,
    } = this.props;
    const { anchorEl } = this.state;
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
          style={{ textAlign: "left", color: hex }}
        >
          <label title={filterElement + " filter is on"}>
            <input
              type="checkbox"
              id={filterElement}
              onChange={this.props.update}
              defaultChecked="true"
            />
            <span>{filterElement}</span>
          </label>
        </MenuItem>
      );
    });
    
    
   return (
          <React.Fragment>
            <div id='topTitle'>
              <span title={this.props.title}>{this.props.title}</span>
              <div id="topUIToolbarExpanded">
                <div
                  id="toolbarUIGap12"
                  className="toolbarUIGap" /* style={{ marginLeft: 'auto' }} */
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
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faEllipsisV}
                        /* onMouseEnter={(event) => {this.toggleDrawer(event, true)}}  */
                        onClick={(event) => {this.toggleDrawer(event, true)}} 
                      />
                    </div>
                  </Tooltip>
                </div>                
                <div
                  id="toolbarUIGap7"
                  className="toolbarUIGap" /* style={{ marginLeft: 'auto' }} */
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
                    <div className="tooltipContainer">
                      <FaLightbulb
                        className={clsx({ [classes.active]: usptoMode })}
                        onClick={() => this.props.uspto(!usptoMode)}
                      />
                    </div>
                  </Tooltip>
                </div>
                <div id="shareDiagram" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Share a diagram'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faShareAlt}
                        onClick={() => this.props.share(this.props.patent)}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
              
            </div>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={(event) => {this.toggleDrawer(event, false)}}              
              disableAutoFocusItem
              PaperProps={{    
                style: {
                  left: '50%',
                  transform: 'translateX(-35%) translateY(9%)',
                }
              }}
              MenuListProps={{
                style: {
                  padding: 0,
                },
              }}
            >
              <MenuItem>
                <div id="fastBackward" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                    title={
                      <Typography color="inherit" variant='body2'>{'Go to start'}</Typography>
                    }
                    placement='top'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faFastBackward}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
                <div id="fastForward" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Go to end'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faFastForward}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
              </MenuItem>
              <MenuItem>
                <div id="prevAssignment" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                    title={
                      <Typography color="inherit" variant='body2'>{'Go to previous assignment'}</Typography>
                    }
                    placement='top'
                    enterDelay={0}
                    TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                    >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faAngleDoubleLeft}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
                <div id="assignmentQuantative" className="toolbarUIQuantative">
                  {this.props.quantatives.assignment.current} /{" "}
                  {this.props.quantatives.assignment.total}
                </div>
                <div id="nextAssignment" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Go to next assignment'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faAngleDoubleRight}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
              </MenuItem>
              <MenuItem>
                <div id="prevAssignee" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Go to previous assignee'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
                <div id="assigneeQuantative" className="toolbarUIQuantative">
                  {this.props.quantatives.assignee.current} /{" "}
                  {this.props.quantatives.assignee.total}
                </div>
                <div id="nextAssignee" className="toolbarUIElement">
                  <Tooltip 
                  className='tooltip'
                  title={
                    <Typography color="inherit" variant='body2'>{'Go to next assignee'}</Typography>
                  }
                  placement='top'
                  enterDelay={0}
                  TransitionComponent={Zoom} TransitionProps={{ timeout: 0 }}
                  >
                    <div className="tooltipContainer">
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        onClick={this.props.update}
                      />
                    </div>
                  </Tooltip>
                </div>
              </MenuItem>
              {filters}
            </Menu>      
          </React.Fragment>
       )
        
  }
    
}


const styles = theme => ({
  active: {
    color: theme.palette.secondary.main,
  },
});

const mapStateToProps = state => ({
  usptoMode: state.ui.usptoMode,
  showThirdParties: state.ui.showThirdParties,
});

const mapDispatchToProps = {
  toggleShow3rdParities,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(PatentTopTitle));

