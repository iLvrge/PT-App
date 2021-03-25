import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faChevronCircleDown,
  faComment,
  faFastBackward,
  faFastForward,
  faFilter,
  faShareAlt,
  faCheckSquare,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";
import { withStyles } from "@material-ui/styles";
import { FaLightbulb } from "react-icons/fa";
import { connect } from "react-redux";
import { toggleShow3rdParities } from "../../../actions/uiActions";
import { FaChevronCircleDown } from "react-icons/fa";
class PatentBottomUI extends React.Component {
  constructor(props_) {
    super(props_);
    this.wrapperRef = React.createRef();

    this.state = { expand: true, filters: false, legend: false };
    this.update = this.update.bind(this);
    this.filtersExpanded = false;
    this.legendExpanded = false;
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.filtersHandler = React.createRef();
    this.filtersPopup = React.createRef();
    this.legendHandler = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  update() {
    this.setState({ expand: !this.state.expand });
  }

  showPopup(e_) {
    if (
      e_.target.id == "PatentrackMultiCheckbox" ||
      e_.target.parentElement.id == "PatentrackMultiCheckbox"
    ) {
      this.setState({ filters: true });
    }
  }

  hidePopup(e_) {
    this.setState({ filters: false });
  }

  handleClickOutside(e_) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(e_.target)) {
      this.setState({ filters: false, legend: false });
    }
  }

  render() {
    const {
      classes,
      usptoMode,
      showThirdParties,
      toggleShow3rdParities,
    } = this.props;
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
        <li
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
        </li>
      );
    });

    return this.state.expand ? (
      <div ref={this.wrapperRef} id="bottomUIToolbarContainer">
        <div id="bottomUIToolbarExpanded">
          {/* <div id='expandOnOff' className='toolbarUIElement' onClick={this.update}><FontAwesomeIcon
              title='toolbar is on' icon={faChevronCircleDown} /></div> */}

          <div id="toolbarUIGap1" className="toolbarUIGap"></div>
          <div id="fastBackward" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to start"
              icon={faFastBackward}
              onClick={this.props.update}
            />
          </div>
          <div id="fastForward" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to end"
              icon={faFastForward}
              onClick={this.props.update}
            />
          </div>
          <div id="toolbarUIGap2" className="toolbarUIGap"></div>
          <div id="prevAssignment" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to previous assignment"
              icon={faAngleDoubleLeft}
              onClick={this.props.update}
            />
          </div>
          <div id="assignmentQuantative" className="toolbarUIQuantative">
            {this.props.quantatives.assignment.current} /{" "}
            {this.props.quantatives.assignment.total}
          </div>
          <div id="nextAssignment" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to next assignment"
              icon={faAngleDoubleRight}
              onClick={this.props.update}
            />
          </div>
          <div id="toolbarUIGap3" className="toolbarUIGap"></div>
          <div id="prevAssignee" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to previous assignee"
              icon={faAngleLeft}
              onClick={this.props.update}
            />
          </div>
          <div id="assigneeQuantative" className="toolbarUIQuantative">
            {this.props.quantatives.assignee.current} /{" "}
            {this.props.quantatives.assignee.total}
          </div>
          <div id="nextAssignee" className="toolbarUIElement">
            <FontAwesomeIcon
              title="go to next assignee"
              icon={faAngleRight}
              onClick={this.props.update}
            />
          </div>
          <div id="toolbarUIGap4" className="toolbarUIGap"></div>
          <div id="show3rdParties" className="toolbarUIElement">
            <FontAwesomeIcon
              title="Show/Hide 3rd Parties"
              icon={showThirdParties ? faCheckSquare : faSquare}
              onClick={() => toggleShow3rdParities(!showThirdParties)}
            />
          </div>
          <div id="toolbarUIGap4_1" className="toolbarUIGap"></div>
          <div
            id="PatentrackMultiCheckbox"
            ref={this.filtersHandler}
            className="toolbarUIElement"
            onMouseEnter={this.showPopup}
            onMouseLeave={this.hidePopup}
            onClick={this.showPopup}
          >
            <FontAwesomeIcon title="go to filters" icon={faFilter} />
            <div
              id="PatentrackFilters"
              ref={this.filtersPopup}
              className="toolbarUIPopup"
              style={showFilters}
            >
              <ul>{filters}</ul>
            </div>
          </div>
          <div id="toolbarUIGap5" className="toolbarUIGap"></div>
          {/* <div id='horizontalExtenderA' className='toolbarUIElement'></div>
            <div id='horizontallExtenderB' className='toolbarUIElement'></div>
            <div id='zoomDiagram' className='toolbarUIElement'></div> */}
          <div
            id="toolbarUIGap7"
            className="toolbarUIGap" /* style={{ marginLeft: 'auto' }} */
          >
            <Tooltip title={"USPTO"}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FaLightbulb
                  className={clsx({ [classes.active]: usptoMode })}
                  onClick={() => this.props.uspto(!usptoMode)}
                />
              </div>
            </Tooltip>
          </div>
          {/* <div id='commentDiagram' className='toolbarUIElement'><FontAwesomeIcon title='comment diagram'
                                                                                   icon={faComment}
                                                                                   onClick={() => this.props.comment(this.props.commentContent)} />
            </div>  */}
          <div id="toolbarUIGap4" className="toolbarUIGap"></div>
          <div id="shareDiagram" className="toolbarUIElement">
            <FontAwesomeIcon
              title="share diagram"
              icon={faShareAlt}
              onClick={() => this.props.share(this.props.patent)}
            />
          </div>
          <div id="toolbarUIGap8" className="toolbarUIGap"></div>
        </div>
      </div>
    ) : (
      <div ref={this.wrapperRef} id="bottomUIToolbarContainer">
        <div id="bottomUIToolbarClosed">
          <div id="toolbarUIGap0" className="toolbarUIGap"></div>
          <div
            id="expandOnOff"
            className="toolbarUIElement"
            onClick={this.update}
          >
            <FontAwesomeIcon title="toolbar is on" icon={faAngleRight} />
          </div>
        </div>
      </div>
    );
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
)(withStyles(styles)(PatentBottomUI));
