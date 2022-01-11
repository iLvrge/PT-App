import React from "react";
import * as d3 from "d3";
import moment from "moment";

const time2String = dateStr => moment(dateStr).format("MM/DD/YYYY");
class PatentTimeline extends React.Component {
  constructor(props_) {
    super(props_);

    this.dateFormat = d3.timeFormat("%m/%d/%Y");
    this.timeParse = d3.timeParse("%s");
  }

  componentDidMount() {
    this.drawTimeline();
  }

  drawTimeline() {
    const g = d3
      .select("#" + this.props.parent)
      .append("g")
      .attr("id", "patentTimeline");

    g.append("line")
      .attr("x1", this.props.params.margin.left)
      .attr("y1", this.props.dates[0].y - this.props.timeline.upperTail)
      .attr("x2", this.props.params.margin.left)
      .attr("y2", this.props.params.height - this.props.params.margin.bottom)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", this.props.timeline.vertical)
      .style("stroke-dasharray", "3, 3");
    let dates = g
      .selectAll(".date")
      .data(this.props.dates)
      .enter()
      .append("g")
      .attr("class", "PatentrackTimelineElement")
      .attr("id", d_ => {
        return "PatentrackTimelineElement_" + d_.nodeID;
      })
      .attr("visibility", "visible")
      .attr("transform", (d_, i_) => {
        return "translate(" + this.props.params.margin.left + "," + d_.y + ")";
      })
      .attr("class", "date");

    dates
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", d_ => d_.x2)
      .attr("y2", 0)
      .attr("stroke", "#FFFFFF")
      .style("stroke-width", this.props.timeline.horizontal)
      .style("stroke-dasharray", "3, 3");
    dates
      .append("text")
      .attr("font-size", this.props.timeline.fontSize)
      .attr("font-weight", 400)
      .attr("fill", this.props.timeline.fontColor)
      .attr("dx", this.props.timeline.dateOffset.x)
      .attr("dy", this.props.timeline.dateOffset.y)
      .text(d_ => time2String(d_.time));
  }

  render() {
    return null;
  }
}

export default PatentTimeline;