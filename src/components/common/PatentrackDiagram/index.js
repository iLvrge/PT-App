import './css/styles.css';

import * as d3 from 'd3';

import PatentLink from './PatentLink';
import PatentNode from './PatentNode';
import PatentTimeline from './PatentTimeline';
import PatentTopTitle from './PatentTopTitle';
import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import config from './config.json';
import { cloneDeep } from 'lodash';

/*

PATENTRACK GENERATIVE DIAGRAM
based on D3.JS v.4.13.0 framework

TODO LIST:

[x] Third parties have to be aligned vertically with first owner 
    and shoudn't have date guidelines.

[x] Make curve lines visually legible, correct theie end markers orientation.

[x] Remove data entries [execution, recorded] from third parties.

[x] Dynamic SVG size according to diagram width and height.
    Keeping 1370px if possible.
    
    What about resposive viewBox parameter?

[x] Split text to 2 lines only, if it doesn't fit - shorten to two lines.

    There are badly shorten name in your JSONs, i.e. Jpmorgan Chase Bank Na (National?)
    
    Looks glitchy. If you can't provide full names, these stumps have to be removed 
    with additional filter.
    
    As well as, ideally, I have to expand punctuation rules, for example avoiding
    Inc/Llc/... alone at the second line. That's a really bad habbit in terms of typography.
    
    There are more minor tweak which could boost punctuation and typography.
    
[!] Comprare srart_id.xy and end_id.xy to set connection type:

    if start_id.x == end_id.x horizontal y1 < y2 down, y1 > y2 up
       start_id.y == end_id.y vertical x1 < x2 right, x1 > x2 left
       
       for curves, just compare x1 and x2 for left, right directions
    
[!] Vertical connections could overlap each other too.
    Fix it.
    
    By now I don't see any overlapping connections in providing JSONs
    Please send one.
    
[!] External JSON selector for debugging.
    
    As you can see it was at live demo, however I don't think you need it as apart of distributive.
    
    You can feed any JSON via 
    
    <PatentrackDiagram data={data_7255357} key={data_7255357 + "_" + Math.random()} />
    
    where data={is actual JSON} key={any unique number}
    
    UPDATE 03.08.2020 / 04.08.2020
    
[x] Box opacity 0.75, could be adjusted at config.json

[x] First owner has only vertical connections coming from inventors.

[x] All inventors shoud have connections coming from mid lower point.

[x] ThirdParty 3 Sector they don't have execution dates [It has to be "execution_date": "NaN-NaN-NaN" ]

[x] Inventer has snake like order

    1  2  3  4 >
    8  7  6  5 <
      11 10  9 <

[!] Onwers could have simular inventor-down connections

    Have to check it, please provide JSON with this setting.
    
[x] Title from general.patent_number, i.e. D720766 Mobile communication device display with graphical user interface comprising security and privacy advisor screens
    or title MOBILE COMMUNICATION DEVICE DISPLAY WITH GRAPHICAL USER INTERFACE COMPRISING SECURITY AND PRIVACY ADVISOR SCREENS
    
    see config.json title.attr parameter, keep correct synthax
    
    UPDATED 10.08.2020
    
[x] Hond mouse pointer over lines

[x] Generative SVG width (right margin would be the same as left)

    UPDATED 13.08.2020
    
[x] Remove PDF icon from third parties

[x] Make vertical lines closer to each other

[x] Date format MM/DD/YYYY

    at timelines and boxes
    While Recorded data by now undefined in JSON, it's now 01/01/1970.

[x] Move boxes close to dates

[x] Align title with first box left side

[x] Cut right SVG margin to minimum

[!] Make timeline dotted lines thinner

    I have added timelines thickness parameter to config.json
    
    timeline.horizontal, by now it's 0.25, vertical, which, in my opinion, could be bolder is 0.75 

[-] 6599309 have one long vertical line overlaping short one.
    
    That's the situation I was talking about and here is a real data with it.
    So, my abstract code didn't work well, now fixing it.
    
    UPDATE 18.08.2020
    
[x] Also, since the illustration is part of the application and not inside an iframe, in order to have natural integration, 
    we need the text size to be based on rem, not pixel, and not calculated. Simple rem units. 
    
    So, All the dates and the text next to the date should be 0.875rem, and the names inside the 
    boxes 1rem, please. The title of the patent, should be something around 1.2rem.
    
    Done, now all font sizes at config.json are set with "rem" unuts.
    
    UPDATE 01.09.2020
    
[x] Closed toolbar jumps to window buttom.

    Fixed.
    
[x] At the beginning there should be ONLY inventors

[x] Make boxes thinner (reduce height)

    I have fixed links, so if you reduce box height, all connections would fit its left/right sides

[x] All elements (boxes, links, gaps...) have to be set in REM units, see config.json

[-] Set triggers for PDF popups and links tooltip (ask guys about that)

[-] Occasionally toolbar skips item

[-] On hovering out the state returns to full visualization

[-] planned, [x] done, [!] see comments

    UPDATE 03.09.2020
    
[x] Minimize gaps between navigation and 'quantatives'

[x] Put legend as pop-up dropdown item

[x] Put all checkboxes to one dropdown item

[x] Add timeline to toobar controls again after portin toolbar to non-ReactJS version

[x] Decrease left and right margins for dates to save some space

[!] Convert curve to straight line

    All coonections are procedurally generated meaning that their positions are predetermine by
    two parameters-order and total number of links for node side.
    
    Please look at /references/procedutalConnections.pdf
    
    I don't say that I couldn't do your request, but it's going against general rules
    and could lead to visual glitches and misconnections.
    
[x] Add PDF icon size to config.json 

[x] Pass all data to PDF popup

    this.props.data.json has uprocessed  JSON box node data
    
[x] Timeline dates x = 3, y = -5
    
    Now, at config.json timeline.dateOffset

[x] Please make title font-size dynamic
    
    It's at CSS styles, I have set it to 1.0 rem
    
[x] Change rounded corners from 6 to 3

    Now, it's at config.json node.rounded
    
[x] There are now two units at config.json

    'rem' and '%'
    
    Have removed abstract 'u' suffix
    
[!] Granted date for inventors

    Need Vikas assistance
    
[-] Multiline title, extend top offset

[x] Gaps between toolbar groups
[x] Since we are going to next stage, I have added placeholder for two horizontal extenders and overal zoom at toolbar
    That's why by now tools look very thin (wide gaps).
    As long as I would put sliders, everything would be fine.
    
[x] Share icon to the end
[x] Remove chevrons from filters & legend
[x] Trigger filters and legend on mouse over
[x] Tooltip position fix

[x] Timeline vertical line has to be the same colour as horizontal ones (entries)
    
    Actually, it was the same colour, but 3x thicker than horizontal lines, and that could be 
    adjusted at config.json timeline.vertical
    
    The tail config.json timeline.upperTail: 32
    
[x] And it has to start from the first entry

    Looks disgusting, it has to have a least offset tail at the beginning.
    
[x] Inventors should have reserved space for PDF (move dates to the right);

[x] Remove legend

[x] Tint filters labels with proper colours

[x] Expand bottom margin

    While I don't have general Patentrack GUI and my rem setting are different, setting margins is always a jepardy.
    
    config.json has two paremeters node.topOffset (it's dynamic, please don't touch it) and node.bottomOffset that could be 
    set manually, so the lowest boxes wouldn't be overlayed by toolbar.
    

REFERENCES:
https://github.com/guardicore/monkey/blob/develop/monkey/monkey_island/cc/ui/src/components/report-components/zerotrust/venn-components/VennDiagram.js
https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

@author Vladimir V. KUCHINOV
@email  helloworld@vkuchinov.co.uk

*/

/*

Also I have little modified your code

<PatentrackDiagram data={props.assets} titleTop={topPosition} toolbarBottom={bottomToolbarPosition} parentWidth={parent_width} key={props.assets + "_" + Math.random()} />

I am passing titleTop parameter

Update your index.js with this

<PatentTopTitle width={this.props.parentWidth} titleTop={this.props.titleTop} title={this.parseTitle()} />

And PatentTopTitle.js

return <div id="topTitle" style={{width: this.props.width - 20 + "px", top: this.props.titleTop + "px"}}>{this.props.title}</div>

in Style.css remove SVG style completely

*/

class PatentrackDiagram extends React.Component {
  constructor(props_) {
    super(props_);

    this.config = cloneDeep(config);

    this.resizeObserver = null;
    this.resizeElement = createRef();

    this.width = this.height = this.config.defaultWidth;
    this.patent = props_.data.box[0].patent_number;
    this.prefix = `patentrackDiagram_${props_.data.box[0].patent_number}`;
    this.data = {
      inventors: [],
      owners: [],
      banks: [],
      thirdParties: [],
      connections: [],
      indices: [],
      assignments: {},
    };
    this.state = {
      assignments: [],
      assignees: [],
      limits: {
        assignments: this.getAssignmentsTotal(this.props.data.connection),
        assignees: this.props.data.connection.length,
      },
      filters: {
        Ownership: true,
        Security: true,
        Release: true,
        License: true,
        LicenseEnd: true,
        NameChange: true,
        Correct: true
      },
      sliderUpdate: false,
      parentWidth: null,
      originalWidth: null,
      previousParentWidth: null,
      activeLine: null,
      prevLineData: null,
      originalGap: this.config.node.gap.x,
      calcGap: null
    };
    this.updateDiagram = this.updateDiagram.bind(this);
    this.structure = [];
    this.inits = true;

    this.convertConfigValuesToPixels();
    this.getTitleDivHeight();
    this.changeParentWidth = this.changeParentWidth.bind(this);   
    this.onClickConnectionLine = this.onClickConnectionLine.bind(this) 
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(entries => {
      if(this.props.chartsBar === true || this.props.analyticsBar === true) {
        const { width } = entries[0].contentRect;
        this.setState({ parentWidth: width, originalWidth:  width});
      }
    });
    
    this.resizeObserver.observe(this.resizeElement.current);
  }

  componentDidUpdate() {
    if (this.state.parentWidth !== null && this.state.previousParentWidth !== null && this.state.parentWidth !== this.state.previousParentWidth) {
      this.setState({ previousParentWidth: this.state.parentWidth}); 
    } 
    if(this.state.assignments.length !== this.state.limits.assignments || this.state.assignees.length !== this.state.limits.assignees) {
      this.domUpdateNodes()
    }    
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }    
  }

  changeParentWidth(percentage) {
    if(percentage > 50) {
      this.setState({
        sliderUpdate: true, 
        parentWidth : percentage > 50 ? parseFloat(this.state.originalWidth) + parseFloat(this.state.originalWidth * ((percentage - 50)*2) / 100) : this.state.parentWidth,
        calcGap: null
      })
    } else if(percentage < 50) {
      this.setState({
        sliderUpdate: true, 
        parentWidth : this.state.parentWidth,
        calcGap: this.state.originalGap - parseFloat(this.state.originalGap * ((50 - percentage)*2) / 100) 
      })
    } else {
      this.setState({
        sliderUpdate: false, 
        parentWidth : this.state.originalWidth,
        calcGap: null
      })
    }
    
  }

  getTitleDivHeight() {
    const dummyDiv = document.createElement('div');

    dummyDiv.className = 'topTitle';
    dummyDiv.innerHTML = this.parseTitle();
    dummyDiv.style.width = `${this.props.parentWidth - 20}px`;
    document.body.appendChild(dummyDiv);
    this.config.node.topOffset = dummyDiv.offsetHeight + 16;
    document.body.removeChild(dummyDiv);
  }

  convertConfigValuesToPixels() {
    const defaultFontSize = Number(
      window
        .getComputedStyle(document.body)
        .getPropertyValue('font-size')
        .replace('px', ''),
    );
    this.parseConfig(config, defaultFontSize);
    this.parseConfig(this.config, defaultFontSize);
  }

  parseConfig(object_, fontSize_) {
    const keys = Object.keys(object_);

    for (let i = 0; i < keys.length; i++) {
      if (typeof object_[keys[i]] === 'object') {
        this.parseConfig(object_[keys[i]], fontSize_);
      } else if (
        typeof object_[keys[i]] === 'string' &&
        object_[keys[i]].includes('rem')
      ) {
        object_[keys[i]] = this.convertUnits(
          object_[keys[i]],
          parseFloat(fontSize_),
          'rem',
        );
      } else if (
        typeof object_[keys[i]] === 'string' &&
        object_[keys[i]].includes('pct')
      ) {
        object_[keys[i]] = this.convertUnits(
          object_[keys[i]],
          parseFloat(this.props.parentWidth),
          'pct',
        );
      }
    }
  }

  convertUnits(value_, multiplier_, suffix_) {
    value_ = value_.replace(suffix_, '');

    if (suffix_ == 'rem') {
      value_ = parseFloat(value_) * multiplier_;
    } else if (suffix_ == 'pct') {
      value_ = (parseFloat(value_) * multiplier_) / 100.0;
    }

    return value_;
  }

  getAssignmentsTotal(connections_) {
    const assignments = {};
    connections_.forEach(connection_ => {
      if (!assignments.hasOwnProperty(connection_.assignment_no1)) {
        assignments[connection_.assignment_no1] = true;
      }
    });

    return Object.keys(assignments).length;
  }


  parseData() {
    let dWidth = 0;
    let dheight = 0;
    const this_ = this;
    const nodes = { inventors: [], owners: [], banks: [], thirdParties: [] };

    this.props.data.box.forEach((box_, i_) => {
      if (Number(box_.segment) == 0) {
        nodes.inventors.push(box_);
        this.data.indices[box_.id] = {
          type: 'inventors',
          i: nodes.inventors.length - 1,
        };
      } else if (box_.segment == 1) {
        nodes.owners.push(box_);
        this.data.indices[box_.id] = {
          type: 'owners',
          i: nodes.owners.length - 1,
        };
      } else if (box_.segment == 2) {
        nodes.banks.push(box_);
        this.data.indices[box_.id] = {
          type: 'banks',
          i: nodes.banks.length - 1,
        };
      } else if (box_.segment == 3) {
        box_.description = 'ThirdParty';
        nodes.thirdParties.push(box_);
        this.data.indices[box_.id] = {
          type: 'thirdParties',
          i: nodes.thirdParties.length - 1,
        };
      }
    });

    const offsets = { owners: 0, banks: 1, thirdParties: 3 };

    nodes.inventors.forEach((inventor_, i_) => {
      this.data.inventors.push({
        id: inventor_.id,
        typeID: { type: 'inventors', i: i_ },
        assignment_no: inventor_.assignment_no,
        name: inventor_.name,
        x:
          Math.floor(i_ / this.config.inventors_per_row) == 0
            ? i_ % this.config.inventors_per_row
            : 3 - (i_ % this.config.inventors_per_row),
        y: Math.floor(i_ / this.config.inventors_per_row),
        date: inventor_.date_1,
        filledDate: inventor_.execution_date,
        grantedDate: inventor_.recorded_date,
        document: null,
        type: 0,
        left: [],
        right: [],
        up: [],
        down: [],
        rounded: 0,
        json: inventor_,
      });

      dWidth = Math.max(
        dWidth,
        this.data.inventors[this.data.inventors.length - 1].x,
      );
    });

    let dx = offsets.owners;

    nodes.owners.sort((a_, b_) => new Date(a_.date_1) - new Date(b_.date_1));

    // owners
    nodes.owners.forEach((owner_, i_) => {
      this.data.owners.push({
        id: owner_.id,
        typeID: { type: 'owners', i: i_ },
        assignment_no: owner_.assignment_no,
        name: owner_.name,
        x: dx,
        y: 0,
        date: owner_.date_1,
        executionDate: owner_.execution_date,
        recordedDate: owner_.recorded_date,
        document: owner_.document,
        type: 1,
        left: [],
        right: [],
        up: [],
        down: [],
        rounded: this.config.node.rounded,
        json: owner_,
      });

      dWidth = Math.max(
        dWidth,
        this.data.owners[this.data.owners.length - 1].x,
      );

      if (
        i_ + 1 <= nodes.owners.length - 1 &&
        nodes.owners[i_ + 1].date_1 == owner_.date_1
      ) {
        dx++;
        offsets.banks = dx + 1;
      } else {
        dx = offsets.owners;
      }
    });

    dx = offsets.banks;

    // banks
    // nodes.banks.sort((a_, b_) => { return new Date(a_.date_1) - new Date(b_.date_1); })

    nodes.banks.forEach((bank_, i_) => {
      this.data.banks.push({
        id: bank_.id,
        typeID: { type: 'banks', i: i_ },
        assignment_no: bank_.assignment_no,
        name: bank_.name,
        x: dx,
        y: 0,
        date: bank_.date_1,
        executionDate: bank_.execution_date,
        recordedDate: bank_.recorded_date,
        document: bank_.document,
        type: 2,
        left: [],
        right: [],
        up: [],
        down: [],
        rounded: this.config.node.rounded,
        json: bank_,
      });

      dWidth = Math.max(dWidth, this.data.banks[this.data.banks.length - 1].x);

      if (
        i_ + 1 <= nodes.banks.length - 1 &&
        nodes.banks[i_ + 1].date_1 == bank_.date_1
      ) {
        dx++;
      } else {
        dx = offsets.banks;
      }
      if (dx >= 3) {
        offsets.thirdParties = dx + 1;
      }
    });

    const mixed = [...this.data.owners, ...this.data.banks].sort(
      (a_, b_) => new Date(a_.date) - new Date(b_.date),
    );

    mixed.forEach((node_, i_) => {
      if (i_ > 0) {
        if (
          node_.date == mixed[i_ - 1].date &&
          node_.type == mixed[i_ - 1].type
        ) {
          node_.y = mixed[i_ - 1].y;
        } else {
          node_.y = mixed[i_ - 1].y + 1;
        }
      } else {
        this.data.inventors.length > 0
          ? (node_.y =
              this.data.inventors[this.data.inventors.length - 1].y + 1 + i_)
          : (node_.y = 0);
      }
      dheight = Math.max(dheight, node_.y);
    });

    dx = offsets.thirdParties;
    let dy =
      this.data.owners.length != 0
        ? this.data.owners[0].y
        : this.data.inventors.length != 0
        ? this.data.inventors[this.data.inventors.length - 1].y + 1
        : 0;

    // third party
    nodes.thirdParties.forEach((thirdParty_, i_) => {
      dheight = Math.max(dheight, dy);

      this.data.thirdParties.push({
        id: thirdParty_.id,
        typeID: { type: 'thirdParties', i: i_ },
        assignment_no: thirdParty_.assignment_no,
        name: thirdParty_.name,
        x: dx,
        y: dy,
        date: thirdParty_.date_1,
        executionDate: null,
        recordedDate: null,
        document: null,
        type: 3,
        left: [],
        right: [],
        up: [],
        down: [],
        rounded: this.config.node.rounded,
        json: thirdParty_,
      });

      dWidth = Math.max(
        dWidth,
        this.data.thirdParties[this.data.thirdParties.length - 1].x,
      );
      dy++;
    });

    // connections
    this.props.data.connection.forEach((connection_, i_) => {
      this.data.connections.push({
        id: i_,
        date: connection_.date_1,
        start_id: this.data.indices[connection_.start_id],
        end_id: this.data.indices[connection_.end_id],
        category: connection_.type,
        color: connection_.color,
        assignment_no: connection_.assignment_no1,
        popup: connection_.popup,
        line: this.props.data.line[i_],
      });
    });

    this.data.popups = {};

    this.props.data.popup.forEach(popup_ => {
      this.data.popups[popup_.id] = popup_;
    });

    const width =
      this.config.node.leftOffset +
      this.config.node.rightOffset +
      dWidth * (this.config.node.width + config.node.gap.x) +
      this.config.node.width;

    // Responsive diagram on increasing container size or diagram already
    // responsive.
    // Make diagram width responsive if parent is increasing or decreasing and
    // its width is bigger than the original diagram width.
    if (
      (this.state.parentWidth &&
        this.state.previousParentWidth &&
        this.state.parentWidth > this.state.previousParentWidth &&
        this.state.parentWidth > width) ||
      (this.state.parentWidth && this.width > width) || 
        this.state.sliderUpdate === true
    ) {
      this.config.node.gap.x = Math.max(
        config.node.gap.x,
        (this.state.parentWidth -
          (this.config.node.leftOffset +
            this.config.node.rightOffset +
            dWidth * this.config.node.width +
            this.config.node.width)) /
          dWidth,
      );

      this.width = this.state.parentWidth;

      if(this.state.calcGap !== null) {
        this.config.node.gap.x = this.state.calcGap
      }
      
    } else {
      this.width = width;
    }
    if(this.state.originalWidth === null) {
      this.setState({originalWidth: this.width})
    }
    this.height =
      (dheight + 1) * (this.config.node.height + this.config.node.gap.y) +
      this.config.node.topOffset +
      this.config.node.bottomOffset;
  }

  parseTitle() {
    if (!config.title.attr.includes('.')) {
      return this.props.data[config.title.attr];
    }
    return this.config.title.attr.split('.').reduce(function(a_, b_) {
      return a_[b_];
    }, this.props.data);
  }

  extendLineParameters(startType_, x1_, y1_, x2_, y2_) {
    let direction;
    let terminals = [];

    if (startType_ == 'inventors') {
      if (x1_ == x2_) {
        direction = 'straight-down';
        terminals = ['down', 'up'];
      } else if (x1_ < x2_) {
        direction = 'down-firstRight';
        terminals = ['down', 'up'];
      } else {
        direction = 'down-firstLeft';
        terminals = ['down', 'up'];
      }
    } else if (x1_ == x2_) {
      if (y1_ < y2_) {
        direction = 'straight-down';
        terminals = ['down', 'up'];
      } else {
        direction = 'straight-up';
        terminals = ['up', 'down'];
      }
    } else if (y1_ == y2_) {
      if (x1_ < x2_) {
        direction = 'complex-right';
        terminals = ['right', 'left'];
      } else {
        direction = 'complex-left';
        terminals = ['left', 'right'];
      }
    } else if (x1_ < x2_) {
      direction = 'complex-right';
      terminals = ['right', 'left'];
    } else {
      direction = 'complex-left';
      terminals = ['left', 'right'];
    }

    return {
      direction,
      startIndex: [0, 0],
      endIndex: [0, 0],
      terminals,
    };
  }

  rearrangeByLeftOpposites(node_, links_) {
    const { left } = node_.props.data;

    left.sort(
      (a_, b_) =>
        this.getOppositeY(links_, a_, 'left') -
        this.getOppositeY(links_, b_, 'left'),
    );

    left.forEach((index_, i_) => {
      if (links_[index_].props.data.direction == 'right') {
        links_[index_].props.data.startIndex[0] = i_;
      } else {
        links_[index_].props.data.endIndex[0] = i_;
      }
    });
  }

  rearrangeByLeftTheta(node_, links_, indent_) {
    const { left } = node_.props.data;

    left.sort(
      (a_, b_) =>
        this.getTheta(links_, a_, indent_) - this.getTheta(links_, b_, indent_),
    );

    left.forEach((index_, i_) => {
      if (links_[index_].props.data.direction == 'right') {
        links_[index_].props.data.startIndex[0] = i_;
      } else {
        links_[index_].props.data.endIndex[0] = i_;
      }
    });
  }

  getTheta(links_, index_, indent_) {
    if (links_[index_].props.data.direction == 'right') {
      const a = {
        x: links_[index_].props.data.x1,
        y: links_[index_].props.data.y1,
      };
      const c = {
        x: links_[index_].props.data.x1 + indent_,
        y: links_[index_].props.data.y1,
      };
      const b = {
        x: links_[index_].props.data.x2 - indent_,
        y: links_[index_].props.data.y2,
      };

      const dx = c.x - b.x;
      const dy = c.y - b.y;

      const theta = (Math.atan2(dy, dx) * 180.0) / Math.PI;
      return theta > 0 ? theta : theta + 360.0;
    }
    const a = {
      x: links_[index_].props.data.x2,
      y: links_[index_].props.data.y2,
    };
    const c = {
      x: links_[index_].props.data.x2 + indent_,
      y: links_[index_].props.data.y2,
    };
    const b = {
      x: links_[index_].props.data.x1 - indent_,
      y: links_[index_].props.data.y1,
    };

    const dx = c.x - b.x;
    const dy = c.y - b.y;

    const theta = (Math.atan2(dy, dx) * 180.0) / Math.PI;
    return theta >= 0 ? theta : theta + 360.0;
  }

  getOppositeY(links_, index_, direction_) {
    if (links_[index_].props.data.direction == direction_) {
      return links_[index_].props.data.y1;
    }
    return links_[index_].props.data.y2;
  }

  getLinkMedianSegment(link_) {
    let x1;
    let y1;
    let x2;
    let y2;
    let startRange = 1.0;
    let endRange = 1.0;
    let startInc = 0.0;
    let endInc = 0.0;

    if (link_.startIndex[1] > 1) {
      startRange = this.remapFloat(
        link_.startIndex[1],
        1.0,
        16.0,
        this.config.node.range.min,
        this.config.node.range.max,
      );
      startInc = this.remapFloat(
        link_.startIndex[0],
        0,
        link_.startIndex[1] - 1,
        -startRange,
        startRange,
      );
    }
    if (link_.endIndex[1] > 1) {
      endRange = this.remapFloat(
        link_.endIndex[1],
        1.0,
        16.0,
        this.config.node.range.min,
        this.config.node.range.max,
      );
      endInc = this.remapFloat(
        link_.endIndex[0],
        0,
        link_.endIndex[1] - 1,
        -endRange,
        endRange,
      );
    }

    if (link_.direction == 'right') {
      x1 =
        this.config.node.leftOffset +
        link_.x1 * (this.config.node.width + this.config.node.gap.x) +
        this.config.node.width;
      y1 =
        this.config.node.topOffset +
        (link_.y1 + startInc) *
          (this.config.node.height + this.config.node.gap.y) +
        this.config.node.height / 2;
      x2 =
        this.config.node.leftOffset +
        link_.x2 * (this.config.node.width + this.config.node.gap.x);
      y2 =
        this.config.node.topOffset +
        (link_.y2 + endInc) *
          (this.config.node.height + this.config.node.gap.y) +
        this.config.node.height / 2;
    } else {
      x1 =
        this.config.node.leftOffset +
        link_.x1 * (this.config.node.width + this.config.node.gap.x);
      y1 =
        this.config.node.topOffset +
        (link_.y1 + startInc) *
          (this.config.node.height + this.config.node.gap.y) +
        this.config.node.height / 2;
      x2 =
        this.config.node.leftOffset +
        link_.x2 * (this.config.node.width + this.config.node.gap.x) +
        this.config.node.width;
      y2 =
        this.config.node.topOffset +
        (link_.y2 + endInc) *
          (this.config.node.height + this.config.node.gap.y) +
        this.config.node.height / 2;
    }

    return { x1, y1, x2, y2 };
  }

  checkIntersectionsNode(node_, links_, direction_) {
    const segments = node_.props.data[direction_].map((index_, i_) => {
      const link = links_[index_].props.data;

      return this.getLinkMedianSegment(link);
    });

    for (let i = 0; i < segments.length; i++) {
      for (let j = 0; j < segments.length; j++) {
        if (i != j) {
          if (this.twoLinesIntersection(segments[i], segments[j])) {
            return true;
            break;
          }
        }
      }
    }

    return false;
  }

  twoLinesIntersection(segment0_, segment1_) {
    const s10x = segment0_.x2 - segment0_.x1;
    const s10y = segment0_.y2 - segment0_.y1;
    const s32x = segment1_.x2 - segment1_.x1;
    const s32y = segment1_.y2 - segment1_.y1;

    const denom = s10x * s32y - s32x * s10y;

    if (denom == 0) {
      return false;
    }

    const denom_positive = denom > 0;

    const s02x = segment0_.x1 - segment0_.x2;
    const s02y = segment0_.y1 - segment0_.y2;

    const s_numer = s10x * s02y - s10y * s02x;

    if (s_numer < 0 == denom_positive) {
      return false;
    }

    const t_numer = s32x * s02y - s32y * s02x;

    if (t_numer < 0 == denom_positive) {
      return false;
    }

    if (
      s_numer > denom == denom_positive ||
      t_numer > denom == denom_positive
    ) {
      return false;
    }

    return true;
  }

  checkForSimilarTimelineEntries(timelines_, next_) {
    let found = false;

    for (let i = 0, n = timelines_.length; i < n; i++) {
      if (next_.time == timelines_[i].time) {
        found = true;
        if (next_.x2 >= timelines_[i].x2) {
          timelines_[i] = next_;
        }
      }
    }

    if (!found) {
      timelines_.push(next_);
    }
  }

  alreadyHasAssigmentNo(indices_, assignment_no_) {
    let out = false;

    for (let i = 0; i < indices_.length; i++) {
      if (indices_[i] == assignment_no_) {
        out = true;
        break;
      }
    }

    return out;
  }

  findAssigmentNo(indices_, index_, assignment_no_) {
    let out = null;

    for (let i = 0; i < indices_.length; i++) {
      if (this.data.connections[indices_[i]].assignment_no == assignment_no_) {
        out = i;
        break;
      }
    }

    return out;
  }

  findAssignmentLinks(links_, assignment_no_, dir_) {
    const out = [];

    links_.forEach(link_ => {
      if (link_.props.data.assignment_no == assignment_no_) {
        out.push(link_);
      }
    });

    return out;
  }

  sortLeftByAtan2(node_, links_) {
    const { left } = node_.props.data;

    left.sort((a_, b_) => {
      const alink = this.getLinkMedianSegment(links_[a_].props.data);
      const blink = this.getLinkMedianSegment(links_[b_].props.data);

      let ac;
      let ab;
      let bc;
      let bb;
      let atheta;
      let btheta;

      if (links_[a_].props.data.direction == 'right') {
        ac = { x: alink.x1 + this.config.link.indent, y: alink.y1 };
        ab = { x: alink.x2 - this.config.link.indent, y: alink.y2 };
      } else {
        ac = { x: alink.x2 + this.config.link.indent, y: alink.y2 };
        ab = { x: alink.x1 - this.config.link.indent, y: alink.y1 };
      }

      if (links_[b_].props.data.direction == 'right') {
        bc = { x: blink.x1 + this.config.link.indent, y: blink.y1 };
        bb = { x: blink.x2 - this.config.link.indent, y: blink.y2 };
      } else {
        bc = { x: blink.x2 + this.config.link.indent, y: blink.y2 };
        bb = { x: blink.x1 - this.config.link.indent, y: blink.y1 };
      }

      atheta = (Math.atan2(ab.y - ac.y, ab.x - ac.x) * 180) / Math.PI;
      btheta = (Math.atan2(bb.y - bc.y, bb.x - bc.x) * 180) / Math.PI;

      return atheta - btheta;
    });

    left.forEach((link_, i_) => {
      if (links_[link_].props.data.direction == 'right') {
        links_[link_].props.data.startIndex[0] = i_;
      } else {
        links_[link_].props.data.endIndex[0] = i_;
      }
    });
  }

  arrangingVerticalConnections(links_) {
    const short = [];
    const long = [];

    links_.forEach((link_, i_) => {
      if (
        link_.props.data.direction.includes('straight') ||
        link_.props.data.direction.includes('first')
      ) {
        link_.props.data.y2 - link_.props.data.y1 == 1
          ? short.push(i_)
          : long.push(i_);
      }
    });

    long.forEach(long_ => {
      short.forEach(short_ => {
        if (
          links_[short_].props.data.y1 >= links_[long_].props.data.y1 &&
          links_[short_].props.data.y2 <= links_[long_].props.data.y2 &&
          links_[short_].props.data.assignment_no !=
            links_[long_].props.data.assignment_no
        ) {
          links_[long_].props.data.startIndex[1]++;
          links_[long_].props.data.endIndex[1]++;
        }
      });
    });

    for (let i = 0; i < long.length; i++) {
      for (let j = i + 1; j < long.length; j++) {
        if (
          links_[long[i]].props.data.y1 <= links_[long[j]].props.data.y2 &&
          links_[long[j]].props.data.y1 <= links_[long[i]].props.data.y2 &&
          links_[long[i]].props.data.assignment_no !=
            links_[long[j]].props.data.assignment_no
        ) {
          links_[long[j]].props.data.startIndex[0]++;
          links_[long[i]].props.data.startIndex[1]++;

          links_[long[j]].props.data.endIndex[0]++;
          links_[long[j]].props.data.endIndex[1]++;

          links_[long[i]].props.data.startIndex[1]++;
          links_[long[i]].props.data.endIndex[1]++;
        }
      }
    }
  }

  updateDiagram(event_) {
    const this_ = this;
    if(this.state.prevLineData !== null) {
      this.props.connectionBox(this.state.prevLineData);
      this.setState({prevLineData: null, activeLine: null})
    }
    
    if (event_.currentTarget.getAttribute('type') == 'checkbox') {
      
      this.state.filters[
        event_.currentTarget.getAttribute('id').replace(' ', '')
      ] = event_.currentTarget.checked;
      event_.currentTarget.checked
        ? event_.currentTarget.parentNode.setAttribute(
            'title',
            `${event_.currentTarget.getAttribute('id')} filter is on`,
          )
        : event_.currentTarget.parentNode.setAttribute(
            'title',
            `${event_.currentTarget.getAttribute('id')} filter is off`,
          );
    } else {
      if (
        event_.currentTarget.parentNode.getAttribute('id') == 'fastBackward'
      ) {
        this.state.assignments = this.state.assignees = [];
      }

      if (event_.currentTarget.parentNode.getAttribute('id') == 'fastForward') {
        const assignments = [];
        const assignees = [];
        Object.keys(this.structure).forEach(key_ => {
          assignments.push(Number(key_));
          this.structure[key_].forEach(assignee_ => {
            assignees.push(assignee_);
          });
        });

        this.state.assignments = assignments;
        this.state.assignees = assignees;
      }

      if (
        event_.currentTarget.parentNode.getAttribute('id') == 'prevAssignment'
      ) {
        const { assignments } = this.state;
        const assignees = [];

        if (assignments.length > 0) {
          assignments.pop();
          assignments.forEach(assignment_ => {
            this.structure[assignment_].forEach(k_ => assignees.push(k_));
          });

          this.state.assignments = assignments;
          this.state.assignees = assignees;
        }
      }

      if (
        event_.currentTarget.parentNode.getAttribute('id') == 'nextAssignment'
      ) {
        const { assignments } = this.state;
        const assignees = [];
        if (assignments.length < this.state.limits.assignments) {
          assignments.push(
            Number(Object.keys(this.structure)[assignments.length]),
          );

          assignments.forEach(assignment_ => {
            this.structure[assignment_].forEach(k_ => assignees.push(k_));
          });

          this.state.assignments = assignments;
          this.state.assignees = assignees;
        }
      }

      if (
        event_.currentTarget.parentNode.getAttribute('id') == 'prevAssignee'
      ) {
        const assignments = [];
        const { assignees } = this.state;

        if (assignees.length > 0) {
          assignees.pop();
        }

        if (assignees.length > 0) {
          for (let i = 0; i < Object.keys(this.structure).length; i++) {
            const key = Object.keys(this.structure)[i];
            if (!this.assigmentIncludes(assignees[assignees.length - 1], key)) {
              assignments.push(key);
            } else {
              assignments.push(key);
              break;
            }
          }
        }

        this.state.assignments = assignments;
        this.state.assignees = assignees;
      }

      if (
        event_.currentTarget.parentNode.getAttribute('id') == 'nextAssignee'
      ) {
        const assignments = [];
        const { assignees } = this.state;

        if (assignees.length == 0) {
          assignees.push(this.structure[Object.keys(this.structure)[0]][0]);
          assignments.push(Object.keys(this.structure)[0]);
        } else {
          const everyAssignee = Object.keys(this.structure).reduce(
            (r_, k_) => r_.concat(this.structure[k_]),
            [],
          );

          for (let i = 0; i < everyAssignee.length; i++) {
            if (assignees[assignees.length - 1] == everyAssignee[i]) {
              if (i < this.state.limits.assignees - 1) {
                assignees.push(everyAssignee[i + 1]);
              }
              break;
            }
          }
        }

        this.state.assignments = assignments;
        this.state.assignees = assignees;
      }

      document.getElementById('assignmentQuantative').innerHTML = `${
        this.state.assignments.length
      } / ${this.state.limits.assignments}`;
      document.getElementById('assigneeQuantative').innerHTML = `${
        this.state.assignees.length
      } / ${this.state.limits.assignees}`;
    }
    this.domUpdateNodes()
  }

  domUpdateNodes(){
    d3.selectAll('.PatentrackLink')
      .nodes()
      .map(node_ => {
        const id = Number(
          node_.attributes.id.value.replace('PatentrackLink_', ''),
        );
        let category = null;

        Object.keys(this.state.filters).forEach(key_ => {
          if (node_.attributes.class.value.includes(key_)) {
            return (category = key_);
          }
        });

        node_.attributes.visibility.value =
          id < this.state.assignees.length && this.state.filters[category]
            ? 'visible'
            : 'hidden';
      });

    d3.selectAll('.PatentrackNode')
      .nodes()
      .map(node_ => {
        const children = [];

        node_.attributes.children.value.split(',').forEach(link_ => {
          const parsed = link_.split('|');

          if (parsed.length > 1) {
            if (
              Number(parsed[0]) < this.state.assignees.length &&
              this.state.filters[parsed[1].replace(' ', '')]
            ) {
              children.push(Number(parsed[0]));
            }
          }
        });

        node_.attributes.visibility.value =
          node_.attributes.type.value == 'inventors' || children.length > 0
            ? 'visible'
            : 'hidden';
        d3.select(
          `#PatentrackTimelineElement${node_.id.replace('PatentrackNode', '')}`,
        ).attr('visibility', node_.attributes.visibility.value);
      });
  }

  assigmentIncludes(assignee_, assignment_) {
    let found = false;

    this.structure[assignment_].forEach(child_ => {
      if (child_ == assignee_) {
        found = true;
      }
    });

    return found;
  }

  filterAssigments(assignments_, type_, id_) {
    let found = false;

    for (let i = 0; i < assignments_.length; i++) {
      this.data.assignments[assignments_[i]][type_].forEach(object_ => {
        if (object_ == id_) {
          found = true;
        }
      });
    }

    return found;
  }

  filterAssignees(assignees_, type_, object_, connections_) {
    let found = false;

    if (type_ == 'connections') {
      for (let i = 0; i < assignees_.length; i++) {
        if (Number(object_.id) == Number(assignees_[i])) {
          found = true;
        }
      }
    } else {
      const connections = {};
      const sides = ['up', 'right', 'down', 'left'];
      assignees_.forEach(key_ => {
        connections[key_] = true;
      });
      sides.forEach(side_ => {
        object_[side_].forEach(id_ => {
          const assignedConnections = this.findConnectionByAssignmentNoAndNodeSide(
            connections_,
            object_.typeID,
            side_,
            id_,
          );
          assignedConnections.forEach(assigned_ => {
            if (
              connections.hasOwnProperty(assigned_.props.data.id) ||
              object_.typeID.type == 'inventors'
            ) {
              found = true;
            }
          });
        });
      });
    }

    return found;
  }

  findConnectionByAssignmentNoAndNodeSide(
    connections_,
    node_,
    side_,
    assignment_no_,
  ) {
    const out = [];

    connections_.forEach(connection_ => {
      const end =
        connection_.props.data.terminals[0] == side_ ? 'start' : 'end';
      if (
        connection_.props.data.terminalIDs[end].type == node_.type &&
        connection_.props.data.terminalIDs[end].i == node_.i
      ) {
        if (connection_.props.data.assignment_no == assignment_no_) {
          out.push(connection_);
        }
      }
    });

    return out;
  }

  filterCategories(categories_, type_, object_, connections_) {
    let found = false;

    if (type_ == 'connections') {
      if (categories_[object_.category]) {
        found = true;
      }
    } else {
      const filters = {};
      const sides = ['up', 'right', 'down', 'left'];
      sides.forEach(side_ => {
        object_[side_].forEach(id_ => {
          const assignedConnections = this.findConnectionByAssignmentNoAndNodeSide(
            connections_,
            object_.typeID,
            side_,
            id_,
          );
          assignedConnections.forEach(assigned_ => {
            const { category } = assigned_.props.data;
            if (!filters.hasOwnProperty(category)) {
              filters[category] = 1;
            } else {
              filters[category]++;
            }
          });
        });
      });

      const keys = Object.keys(this.state.filters);
      keys.forEach(key_ => {
        if (filters.hasOwnProperty(key_)) {
          if (!this.state.filters[key_]) {
            delete filters[key_];
          }
        }
      });

      if (Object.keys(filters).length > 0) {
        found = true;
      }
    }

    return found;
  }

  setAssignmentStructure(connections_) {
    const structure = {};

    connections_.sort((a_, b_) => {
      return a_.props.data.assignment_no - b_.props.data.assignment_no;
    });
    connections_.forEach((connection_, i_) => {
      if (
        i_ == 0 ||
        connection_.props.data.assignment_no !=
          connections_[i_ - 1].props.data.assignment_no
      ) {
        structure[connection_.props.data.assignment_no] = [];
      }

      structure[connection_.props.data.assignment_no].push(
        connection_.props.data.id,
      );
    });

    return structure;
  }

  generateHashhKet() {
    let out = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 16; i++) {
      out += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return out;
  }

  lerpFloat(a_, b_, t_) {
    return a_ + t_ * (b_ - a_);
  }

  remapFloat(v_, min0_, max0_, min1_, max1_) {
    return min1_ + ((v_ - min0_) / (max0_ - min0_)) * (max1_ - min1_);
  }

  between(v_, min_, max_) {
    return v_ >= min_ && v_ <= max_;
  }

  onClickConnectionLine(data) {
    if(data.id !== this.state.activeLine) {
      this.setState({activeLine: data.id, prevLineData: data.line})      
    } else {
      this.setState({activeLine: null, prevLineData: null}); 
    }    
     this.props.connectionBox(data.line); 
  }
  
  render() {
    this.data = {
      inventors: [],
      owners: [],
      banks: [],
      thirdParties: [],
      connections: [],
      indices: [],
      assignments: {},
    };

    const { showThirdParties, isDarkTheme, themeMode } = this.props;

    this.parseData();

    const this_ = this;
    const timelines = [];

    

    const svgParams = this.config.responsive
      ? {
          viewBox: `0 0 ${this.width} ${this.height}`,
          preserveAspectRatio: 'xMidYMid meet',
        }
      : { width: this.width, height: this.height };

    const params = {
      width: this.width,
      height: this.height,
      margin: this.config.margin,
    };

    let links = !showThirdParties
      ? this.data.connections.filter(
          link_ =>
            !link_.start_id?.type?.includes("thirdParties") &&
            !link_.end_id?.type?.includes("thirdParties"),
        )
      : this.data.connections;

    links = links.map((link_, i_) => {
      const extention = this.extendLineParameters(
        link_.start_id.type,
        this.data[link_.start_id.type][link_.start_id.i].x,
        this.data[link_.start_id.type][link_.start_id.i].y,
        this.data[link_.end_id.type][link_.end_id.i].x,
        this.data[link_.end_id.type][link_.end_id.i].y,
      );

      if (
        !this.alreadyHasAssigmentNo(
          this.data[link_.start_id.type][link_.start_id.i][
            extention.terminals[0]
          ],
          link_.assignment_no,
        )
      ) {
        this.data[link_.start_id.type][link_.start_id.i][
          extention.terminals[0]
        ].push(link_.assignment_no);
        extention.startIndex[0] =
          this.data[link_.start_id.type][link_.start_id.i][
            extention.terminals[0]
          ].length - 1;
      }

      if (
        !this.alreadyHasAssigmentNo(
          this.data[link_.end_id.type][link_.end_id.i][extention.terminals[1]],
          link_.assignment_no,
        )
      ) {
        this.data[link_.end_id.type][link_.end_id.i][
          extention.terminals[1]
        ].push(link_.assignment_no);
        extention.endIndex[0] =
          this.data[link_.end_id.type][link_.end_id.i][extention.terminals[1]]
            .length - 1;
      }

      const linkData = {
        id: i_,
        x1: this.data[link_.start_id.type][link_.start_id.i].x,
        y1: this.data[link_.start_id.type][link_.start_id.i].y,
        x2: this.data[link_.end_id.type][link_.end_id.i].x,
        y2: this.data[link_.end_id.type][link_.end_id.i].y,
        assignment_no: link_.assignment_no,
        terminalIDs: { start: link_.start_id, end: link_.end_id },
        terminals: extention.terminals,
        startIndex: extention.startIndex,
        endIndex: extention.endIndex,
        category: link_.category,
        direction: extention.direction,
        color: link_.color,
        indent: this.config.link.indent,
        popup: this.data.popups[link_.popup],
        line: link_.line,
      };

      if (this.data.assignments[linkData.assignment_no] == undefined) {
        this.data.assignments[linkData.assignment_no] = {
          nodes: [],
          connections: [],
        };
      }
      this.data.assignments[linkData.assignment_no].connections.push(
        linkData.id,
      );

      return (
        <PatentLink
          id={`PatentrackLink_${link_.id}`}
          key={`Link_${i_}`}
          svg={`svg_${this.prefix}`}
          onClickConnectionLine={this.onClickConnectionLine}
          activeLine={this.state.activeLine}
          parent="patentLinksGroup"
          data={linkData}
          config={this.config}
        />
      );
    });

    let nodes = [];
    if (showThirdParties) {
      nodes = [
        ...this.data.inventors,
        ...this.data.owners,
        ...this.data.banks,
        ...this.data.thirdParties,
      ];
    } else {
      nodes = [...this.data.inventors, ...this.data.owners, ...this.data.banks];
    }

    nodes = nodes.map((node_, i_) => {
      const children = [];

      ['left', 'right', 'up', 'down'].forEach(dir_ => {
        node_[dir_].forEach((assignment_, i_) => {
          const assignmentLinks = this.findAssignmentLinks(
            links,
            assignment_,
            dir_,
          );

          assignmentLinks.forEach(link_ => {
            if (
              link_.props.data.terminals[0] == dir_ &&
              link_.props.data.terminalIDs.start.type == node_.typeID.type &&
              link_.props.data.terminalIDs.start.i == node_.typeID.i
            ) {
              link_.props.data.startIndex[0] = i_;
              link_.props.data.startIndex[1] = node_[dir_].length;
              children.push(link_);
            }
            if (
              link_.props.data.terminals[1] == dir_ &&
              link_.props.data.terminalIDs.end.type == node_.typeID.type &&
              link_.props.data.terminalIDs.end.i == node_.typeID.i
            ) {
              link_.props.data.endIndex[0] = i_;
              link_.props.data.endIndex[1] = node_[dir_].length;
              children.push(link_);
            }
          });
        });
      });

      if (this.data.assignments[node_.assignment_no] == undefined) {
        this.data.assignments[node_.assignment_no] = {
          nodes: [],
          connections: [],
        };
      }
      this.data.assignments[node_.assignment_no].nodes.push(node_.id);

      return (
        <PatentNode
          id={`PatentrackNode_${node_.id}`}
          key={`${node_.type}_${i_}`}
          parent="patentNodesGroup"
          data={node_}
          node={this.config.node}
          childrenLinks={children}
          pdfView={this.props.pdfView}
          themeMode={themeMode}
          isDarkTheme={isDarkTheme}
        />
      );
    });

    this.arrangingVerticalConnections(links);
    this.structure = this.setAssignmentStructure(links);

    if (this.inits) {
      this.state.assignments = Object.keys(this.structure).map(key_ =>
        Number(key_),
      );
      this.state.assignees = Array.from(Array(links.length).keys());
      this.inits = false;
    }

    nodes.forEach(node_ => {
      if (node_.props.data.type != 3) {
        const timelineEntry = {
          nodeID: node_.props.data.id,
          time: node_.props.data.date,
          x2:
            this.config.node.leftOffset +
            node_.props.data.x *
              (this.config.node.width + this.config.node.gap.x) -
            this.config.margin.left,
          y:
            this.config.node.topOffset +
            node_.props.data.y *
              (this.config.node.height + this.config.node.gap.y) +
            this.config.node.height / 2,
        };

        this.checkForSimilarTimelineEntries(timelines, timelineEntry);
      }
    });
    console.log('isDarkTheme', isDarkTheme, themeMode)
    return (
      <div id="patentrackDiagramDiv" ref={this.resizeElement}>
        <PatentTopTitle
          width={this.props.parentWidth}
          titleTop={this.props.titleTop}
          title={this.parseTitle()}
          update={this.updateDiagram}
          changeParentWidth={this.changeParentWidth}
          uspto={this.props.uspto}
          comment={this.props.comment}
          commentContent={this.props.data.comment}
          share={this.props.share}
          patent={this.props.data.general}
          colorScheme={config.colors}
          toolbarBottom={this.props.toolbarBottom}
          fullScreen={this.props.fullScreen}
          isFullscreenOpen={this.props.isFullscreenOpen}
          toggleShow3rdParities={this.props.toggleShow3rdParities}
          showThirdParties={this.props.showThirdParties}
          usptoMode={this.props.usptoMode}
          config={this.config}
          quantatives={{
            assignment: {
              current:
                this.state.assignments.length == 0
                  ? 0
                  : this.state.assignments[this.state.assignments.length - 1],
              total: this.state.limits.assignments,
            },
            assignee: {
              current:
                this.state.assignees.length == 0
                  ? 0
                  : this.state.assignees[this.state.assignees.length - 1] + 1,
              total: this.state.limits.assignees,
            },
          }}
        />
        <svg
          id={`svg_${this.prefix}`}
          {...svgParams}
          key={this.generateHashhKet()}
          mlndes="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className={`svg_diagram`}
        >
          <g id="parentTimelineGrid">
            <PatentTimeline
              parent="parentTimelineGrid"
              params={params}
              dates={timelines}
              timeline={config.timeline}
              themeMode={themeMode}
              isDarkTheme={isDarkTheme}
            />
          </g>
          <g id="patentLinksGroup">{links}</g>
          <g id="patentNodesGroup">{nodes}</g>
          {
            this.props.copyrights && (
              <g transform={`translate(16,${svgParams.height ? svgParams.height - 20 : this.height })`}>
                <text fill={isDarkTheme ? themeMode.dark.palette.text.primary : themeMode.light.palette.text.primary}><tspan>The illustrations, and the systems and methods by which they were created, are copyright</tspan> <tspan x="0" dy="14.25">protected and covered by several pending patent applications.</tspan></text>
              </g>
            )  
          } 
        </svg>
      </div>
    );
  }
}

export default PatentrackDiagram;