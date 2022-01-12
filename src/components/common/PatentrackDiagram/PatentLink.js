import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class PatentLink extends React.Component {
  constructor(props_) {
    super(props_);
    this.node = props_.config.node;
    this.path = 'M0,0';
    this.comment = 'type any comment here';

    this.types = [
      d3.curveLinear,
      d3.curveBasis,
      d3.curveBasisClosed,
      d3.curveBundle.beta(0),
      d3.curveBundle.beta(0.5),
      d3.curveBundle.beta(1.0),
      d3.curveCardinal.tension(0),
      d3.curveCardinal.tension(0.5),
      d3.curveCardinal.tension(1.0),
      d3.curveCatmullRom.alpha(0),
      d3.curveCatmullRom.alpha(0.5),
      d3.curveCatmullRom.alpha(1.0),
      d3.curveMonotoneX,
      d3.curveMonotoneY,
      d3.curveNatural,
      d3.curveStep,
      d3.curveStepBefore,
      d3.curveStepAfter,
    ];

    this.curve = d3
      .line()
      .x(function(d_) {
        return d_.x;
      })
      .y(function(d_) {
        return d_.y;
      })
      .curve(this.types[1]);
  }

  componentDidMount() {
    this.drawLink();
  }

  drawLink() {
    this.updatePositions();

    //set CSS classes for filters and playback
    let g = d3
      .select('#' + this.props.parent)
      .append('g')
      .attr('id', 'PatentrackLink_' + this.props.data.id)
      .attr('class', () => {
        return (
          'PatentrackLink ' +
          this.props.data.category.replace(' ', '') +
          ' ' +
          'assignment_no_' +
          this.props.data.assignment_no
        );
      })
      .attr('visibility', 'visible');

    //backkground hitarea
    g.append('path')
      .attr('d', this.path)
      .attr('stroke-width', this.props.config.link.hitArea * 2)
      .attr('stroke', 'transparent')
      .attr('fill', 'none')
      .attr('cursor', 'pointer')
      .on('mouseover', () => {
        let dx = d3.event.offsetX + this.props.config.link.tooltip.x,
          dy = d3.event.offsetY + this.props.config.link.tooltip.y;

        d3.select('#' + this.props.parent)
          .append('text')
          .attr('id', 'dummy')
          .attr('font-size', this.props.config.link.tooltip.fontSize)
          .text(this.props.data.category);
        let bbox = d3
          .select('#dummy')
          .node()
          .getBBox();
        d3.selectAll('#dummy').remove();

        d3.select('#' + this.props.svg)
          .append('rect')
          .attr('x', dx)
          .attr('y', dy)
          .attr('rx', this.props.config.link.tooltip.corners)
          .attr('ry', this.props.config.link.tooltip.corners)
          .attr('class', 'link-tooltip')
          .attr('width', bbox.width * 1.4)
          .attr('height', bbox.height * 1.4)
          .attr('fill', this.props.config.node.background)
          .attr('stroke', this.props.config.node.border)
          .attr('opacity', this.props.config.node.opacity);

        d3.select('#' + this.props.svg)
          .append('text')
          .attr('x', dx + (bbox.width * 1.4) / 2)
          .attr('y', dy + (bbox.height * 1.4) / 2)
          .attr('class', 'link-tooltip')
          .attr(
            'fill',
            this.props.config.colors[
              this.props.data.category.charAt(0).toLowerCase() +
                this.props.data.category.slice(1).replace(' ', '')
            ],
          )
          .attr('font-size', this.props.config.link.tooltip.fontSize)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text(this.props.data.category);
      })
      .on('mouseout', () => {
        d3.selectAll('.link-tooltip').remove();
      })
      .on('click', () => {
        //passing referenced data from json.popup and handleComment
        //this.props.comment is a handler
        //this.props.commentContent is the comment content (string or HTML (have to be parsed))

        console.log(this.props.data);
        this.props.connectionBox(this.props.data.line, this.props.comment);
      });

    g.append('path')
      .attr('d', this.path)
      .attr('id', 'link_' + this.props.data.id)
      .attr('pointer-events', 'none')
      .attr('stroke-width', this.props.config.link.width)
      .attr('stroke', this.props.data.color)
      .attr('fill', 'none');

    g.append('path')
      .attr('transform', () => {
        if (this.props.data.terminals[1] == 'up') {
          let increments = { x: 0, y: -4 },
            theta = 180;
          let total = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getPointAtLength(total);
          return (
            'translate(' +
            (p.x + increments.x) +
            ',' +
            (p.y + increments.y) +
            '),rotate(' +
            theta +
            ')'
          );
        } else if (this.props.data.terminals[1] == 'right') {
          let increments = { x: 4, y: 0 },
            theta = -90;
          let total = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getPointAtLength(total);
          return (
            'translate(' +
            (p.x + increments.x) +
            ',' +
            (p.y + increments.y) +
            '),rotate(' +
            theta +
            ')'
          );
        } else if (this.props.data.terminals[1] == 'left') {
          let increments = { x: -4, y: 0 },
            theta = 90;
          let total = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getPointAtLength(total);
          return (
            'translate(' +
            (p.x + increments.x) +
            ',' +
            (p.y + increments.y) +
            '),rotate(' +
            theta +
            ')'
          );
        } else if (this.props.data.terminals[1] == 'down') {
          let increments = { x: 0, y: 4 },
            theta = 0;
          let total = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select('#' + 'link_' + this.props.data.id)
            .node()
            .getPointAtLength(total);
          return (
            'translate(' +
            (p.x + increments.x) +
            ',' +
            (p.y + increments.y) +
            '),rotate(' +
            theta +
            ')'
          );
        }
      })
      .attr(
        'd',
        d3
          .symbol()
          .type(d3.symbolTriangle)
          .size(18),
      )
      .attr('fill', this.props.data.color);
  }

  updatePositions() {
    let range = 0.35,
      dx0,
      dx1,
      dy0,
      dy1;
    let boxOffset = { x1: 0, y1: 0, x2: 0, y2: 0 };

    if (this.props.data.terminals[1].includes('up')) {
      range = 0.2;
    }

    if (this.props.data.startIndex[1] > 1) {
      if (
        this.props.data.terminals[0] == 'right' ||
        this.props.data.terminals[0] == 'left'
      ) {
        this.props.data.y1 = this.props.data.y1;
        boxOffset.y1 =
          this.remapFloat(
            this.props.data.startIndex[0],
            0,
            this.props.data.startIndex[1] - 1,
            -range,
            range,
          ) * this.node.height;
      } else {
        this.props.data.x1 = this.props.data.x1;
        boxOffset.x1 =
          this.remapFloat(
            this.props.data.startIndex[0],
            0,
            this.props.data.startIndex[1] - 1,
            -range,
            range,
          ) * this.node.width;
      }
    }

    if (this.props.data.endIndex[1] > 1) {
      if (
        this.props.data.terminals[1] == 'right' ||
        this.props.data.terminals[1] == 'left'
      ) {
        this.props.data.y2 = this.props.data.y2;
        boxOffset.y2 =
          this.remapFloat(
            this.props.data.endIndex[0],
            0,
            this.props.data.endIndex[1] - 1,
            -range,
            range,
          ) * this.node.height;
      } else {
        this.props.data.x2 = this.props.data.x2;
        boxOffset.x2 =
          this.remapFloat(
            this.props.data.endIndex[0],
            0,
            this.props.data.endIndex[1] - 1,
            -range,
            range,
          ) * this.node.width;
      }
    }

    if (this.props.data.direction == 'straight-down') {
      this.props.data.y1 =
        this.node.topOffset +
        this.props.data.y1 * (this.node.height + this.node.gap.y) +
        this.node.height +
        boxOffset.y1;
      this.props.data.x2 =
        this.node.leftOffset +
        this.props.data.x2 * (this.node.width + this.node.gap.x) +
        this.node.width / 2 +
        boxOffset.x2;
      this.props.data.y2 =
        this.node.topOffset +
        this.props.data.y2 * (this.node.height + this.node.gap.y) +
        boxOffset.y2;
      if ((this.props.data.startIndex[1] = 1)) {
        this.props.data.x1 = this.props.data.x2;
      } else {
        this.props.data.x1 =
          this.node.leftOffset +
          this.props.data.x1 * (this.node.width + this.node.gap.x) +
          this.node.width / 2;
      }
    } else if (this.props.data.direction == 'straight-up') {
      this.props.data.y1 =
        this.node.topOffset +
        this.props.data.y1 * (this.node.height + this.node.gap.y) +
        boxOffset.y1;
      this.props.data.x2 =
        this.node.leftOffset +
        this.props.data.x1 * (this.node.width + this.node.gap.x) +
        this.node.width / 2 +
        boxOffset.x2;
      this.props.data.y2 =
        this.node.topOffset +
        this.props.data.y2 * (this.node.height + this.node.gap.y) +
        this.node.height +
        boxOffset.y2;
      if ((this.props.data.startIndex[1] = 1)) {
        this.props.data.x1 = this.props.data.x2;
      } else {
        this.props.data.x1 =
          this.node.leftOffset +
          this.props.data.x1 * (this.node.width + this.node.gap.x) +
          this.node.width / 2;
      }
    } else if (this.props.data.direction == 'straight-right') {
      this.props.data.x1 =
        this.node.leftOffset +
        this.props.data.x1 * (this.node.width + this.node.gap.x) +
        this.node.width +
        boxOffset.x1;
      this.props.data.x2 =
        this.node.leftOffset +
        this.props.data.x2 * (this.node.width + this.node.gap.x) +
        boxOffset.x2;
      this.props.data.y2 =
        this.node.topOffset +
        this.props.data.y2 * (this.node.height + this.node.gap.y) +
        this.node.height / 2 +
        boxOffset.y2;
      if (this.props.data.startIndex[1] == 1) {
        this.props.data.y1 = this.props.data.y2;
      } else {
        this.props.data.y1 =
          this.node.topOffset +
          this.props.data.y1 * (this.node.height + this.node.gap.y) +
          this.node.height / 2;
      }
    } else if (this.props.data.direction == 'straight-left') {
      this.props.data.x1 =
        this.node.leftOffset +
        this.props.data.x1 * (this.node.width + this.node.gap.x) +
        boxOffset.x1;
      this.props.data.x2 =
        this.node.leftOffset +
        this.props.data.x2 * (this.node.width + this.node.gap.x) +
        this.node.width +
        boxOffset.x2;
      this.props.data.y2 =
        this.node.topOffset +
        this.props.data.y2 * (this.node.height + this.node.gap.y) +
        this.node.height / 2 +
        boxOffset.y2;
      if (this.props.data.startIndex[1] == 1) {
        this.props.data.y1 = this.props.data.y2;
      } else {
        this.props.data.y1 =
          this.node.topOffset +
          this.props.data.y1 * (this.node.height + this.node.gap.y) +
          this.node.height / 2;
      }
    } else {
      if (
        this.props.data.terminals[0] == 'down' ||
        this.props.data.terminals[0] == 'up'
      ) {
        this.props.data.terminals[0] == 'up' ? (dy0 = 0) : (dy0 = 1);
        this.props.data.x1 =
          this.node.leftOffset +
          this.props.data.x1 * (this.node.width + this.node.gap.x) +
          this.node.width / 2 +
          boxOffset.x1;
        this.props.data.y1 =
          this.node.topOffset +
          this.props.data.y1 * (this.node.height + this.node.gap.y) +
          this.node.height * dy0 +
          boxOffset.y1;
      }

      if (
        this.props.data.terminals[0] == 'right' ||
        this.props.data.terminals[0] == 'left'
      ) {
        this.props.data.terminals[0] == 'right' ? (dx0 = 1) : (dx0 = 0);
        this.props.data.y1 =
          this.node.topOffset +
          this.props.data.y1 * (this.node.height + this.node.gap.y) +
          this.node.height / 2 +
          boxOffset.y1;
        this.props.data.x1 =
          this.node.leftOffset +
          this.props.data.x1 * (this.node.width + this.node.gap.x) +
          this.node.width * dx0 +
          boxOffset.x1;
      }

      if (
        this.props.data.terminals[1] == 'down' ||
        this.props.data.terminals[1] == 'up'
      ) {
        let dy1;
        this.props.data.terminals[1] == 'up' ? (dy1 = 0) : (dy1 = 1);
        this.props.data.x2 =
          this.node.leftOffset +
          this.props.data.x2 * (this.node.width + this.node.gap.x) +
          this.node.width / 2 +
          boxOffset.x2;
        this.props.data.y2 =
          this.node.topOffset +
          this.props.data.y2 * (this.node.height + this.node.gap.y) +
          this.node.height * dy1 +
          boxOffset.y2;
      }

      if (
        this.props.data.terminals[1] == 'right' ||
        this.props.data.terminals[1] == 'left'
      ) {
        this.props.data.terminals[1] == 'right' ? (dx1 = 1) : (dx1 = 0);
        this.props.data.y2 =
          this.node.topOffset +
          this.props.data.y2 * (this.node.height + this.node.gap.y) +
          this.node.height / 2 +
          boxOffset.y2;
        this.props.data.x2 =
          this.node.leftOffset +
          this.props.data.x2 * (this.node.width + this.node.gap.x) +
          this.node.width * dx1 +
          boxOffset.x2;
      }
    }

    this.path = this.getStraightMedianPoints();
  }

  getStraightMedianPoints() {
    let out = [];
    let multiplicators = [0, 0, 0, 0]; //x1, x2, y1, y2

    if (!this.props.data.direction.includes('straight')) {
      if (this.props.data.terminals[0] == 'right') {
        multiplicators[0] = 1;
      } else if (this.props.data.terminals[0] == 'left') {
        multiplicators[0] = -1;
      } else if (this.props.data.terminals[0] == 'up') {
        multiplicators[2] = -1;
      } else if (this.props.data.terminals[0] == 'down') {
        multiplicators[2] = 1;
      }

      if (this.props.data.terminals[1] == 'right') {
        multiplicators[1] = 1;
      } else if (this.props.data.terminals[1] == 'left') {
        multiplicators[1] = -1;
      } else if (this.props.data.terminals[1] == 'up') {
        multiplicators[3] = -1;
      } else if (this.props.data.terminals[1] == 'down') {
        multiplicators[3] = 1;
      }
    }

    let d = '';

    out.push({ x: this.props.data.x1, y: this.props.data.y1 });
    out.push({
      x: this.props.data.x1 + this.props.data.indent * multiplicators[0],
      y: this.props.data.y1 + this.props.data.indent * multiplicators[2],
    });

    out.push({
      x: this.props.data.x2 + this.props.data.indent * multiplicators[1],
      y: this.props.data.y2 + this.props.data.indent * multiplicators[3],
    });
    out.push({ x: this.props.data.x2, y: this.props.data.y2 });

    d = 'M' + out[0].x + ',' + out[0].y;
    for (let i = 1; i < out.length; i++) {
      d += ' L' + out[i].x + ',' + out[i].y;
    }

    return d;
  }

  lerpFloat(a_, b_, t_) {
    return a_ + t_ * (b_ - a_);
  }
  remapFloat(v_, min0_, max0_, min1_, max1_) {
    return min1_ + ((v_ - min0_) / (max0_ - min0_)) * (max1_ - min1_);
  }
  render() {
    return null;
  }
}

export default PatentLink;