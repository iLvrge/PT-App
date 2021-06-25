import { useEffect } from "react";
import moment from "moment";
import * as d3 from "d3";

function getStraightMedianPoints(propData) {
  let out = [];
  let multiplicators = [0, 0, 0, 0]; //x1, x2, y1, y2

  if (!propData.direction.includes("straight")) {
    if (propData.terminals[0] == "right") {
      multiplicators[0] = 1;
    } else if (propData.terminals[0] == "left") {
      multiplicators[0] = -1;
    } else if (propData.terminals[0] == "up") {
      multiplicators[2] = -1;
    } else if (propData.terminals[0] == "down") {
      multiplicators[2] = 1;
    }

    if (propData.terminals[1] == "right") {
      multiplicators[1] = 1;
    } else if (propData.terminals[1] == "left") {
      multiplicators[1] = -1;
    } else if (propData.terminals[1] == "up") {
      multiplicators[3] = -1;
    } else if (propData.terminals[1] == "down") {
      multiplicators[3] = 1;
    }
  }

  let d = "";

  out.push({ x: propData.x1, y: propData.y1 });
  out.push({
    x: propData.x1 + propData.indent * multiplicators[0],
    y: propData.y1 + propData.indent * multiplicators[2],
  });

  out.push({
    x: propData.x2 + propData.indent * multiplicators[1],
    y: propData.y2 + propData.indent * multiplicators[3],
  });
  out.push({ x: propData.x2, y: propData.y2 });

  d = "M" + out[0].x + "," + out[0].y;
  for (let i = 1; i < out.length; i++) {
    d += " L" + out[i].x + "," + out[i].y;
  }

  return d;
}

function remapFloat(v_, min0_, max0_, min1_, max1_) {
  return min1_ + ((v_ - min0_) / (max0_ - min0_)) * (max1_ - min1_);
}



const time2String = dateStr => moment(dateStr).format("MM/DD/YYYY");

export default function PatentLink(props) {
  const { data, config, parent, svg, comment, connectionBox } = props;

  function resetAllActivePDF() {
    const element = document.querySelector(
      "g#patentNodesGroup",
    )
    const images = element.querySelectorAll('image')
    
    if(images != null && images.length > 0) {
      [].forEach.call(images, function(el) {
        el.setAttribute('href',config.pdfIcon)
      })
    }
  }
  useEffect(() => {
    let straightPath = "M0, 0";
    function updatePositions() {
      let range = 0.35,
        dx0,
        dx1,
        dy0,
        dy1;
      let boxOffset = { x1: 0, y1: 0, x2: 0, y2: 0 };

      if (data.terminals[1].includes("up")) {
        range = 0.2;
      }

      if (data.startIndex[1] > 1) {
        if (data.terminals[0] == "right" || data.terminals[0] == "left") {
          data.y1 = data.y1;
          boxOffset.y1 =
            remapFloat(
              data.startIndex[0],
              0,
              data.startIndex[1] - 1,
              -range,
              range,
            ) * config.node.height;
        } else {
          data.x1 = data.x1;
          boxOffset.x1 =
            remapFloat(
              data.startIndex[0],
              0,
              data.startIndex[1] - 1,
              -range,
              range,
            ) * config.node.width;
        }
      }

      if (data.endIndex[1] > 1) {
        if (data.terminals[1] == "right" || data.terminals[1] == "left") {
          data.y2 = data.y2;
          boxOffset.y2 =
            remapFloat(
              data.endIndex[0],
              0,
              data.endIndex[1] - 1,
              -range,
              range,
            ) * config.node.height;
        } else {
          data.x2 = data.x2;
          boxOffset.x2 =
            remapFloat(
              data.endIndex[0],
              0,
              data.endIndex[1] - 1,
              -range,
              range,
            ) * config.node.width;
        }
      }

      if (data.direction == "straight-down") {
        data.y1 =
          config.node.topOffset +
          data.y1 * config.node.gap.y +
          config.node.height +
          boxOffset.y1;
        data.x2 =
          config.node.leftOffset +
          data.x2 * config.node.gap.x +
          config.node.width / 2 +
          boxOffset.x2;
        data.y2 =
          config.node.topOffset + data.y2 * config.node.gap.y + boxOffset.y2;
        if ((data.startIndex[1] = 1)) {
          data.x1 = data.x2;
        } else {
          data.x1 =
            config.node.leftOffset +
            data.x1 * config.node.gap.x +
            config.node.width / 2;
        }
      } else if (data.direction == "straight-up") {
        data.y1 =
          config.node.topOffset + data.y1 * config.node.gap.y + boxOffset.y1;
        data.x2 =
          config.node.leftOffset +
          data.x1 * config.node.gap.x +
          config.node.width / 2 +
          boxOffset.x2;
        data.y2 =
          config.node.topOffset +
          data.y2 * config.node.gap.y +
          config.node.height +
          boxOffset.y2;
        if ((data.startIndex[1] = 1)) {
          data.x1 = data.x2;
        } else {
          data.x1 =
            config.node.leftOffset +
            data.x1 * config.node.gap.x +
            config.node.width / 2;
        }
      } else if (data.direction == "straight-right") {
        data.x1 =
          config.node.leftOffset +
          data.x1 * config.node.gap.x +
          config.node.width +
          boxOffset.x1;
        data.x2 =
          config.node.leftOffset + data.x2 * config.node.gap.x + boxOffset.x2;
        data.y2 =
          config.node.topOffset +
          data.y2 * config.node.gap.y +
          config.node.height / 2 +
          boxOffset.y2;
        if (data.startIndex[1] == 1) {
          data.y1 = data.y2;
        } else {
          data.y1 =
            config.node.topOffset +
            data.y1 * config.node.gap.y +
            config.node.height / 2;
        }
      } else if (data.direction == "straight-left") {
        data.x1 =
          config.node.leftOffset + data.x1 * config.node.gap.x + boxOffset.x1;
        data.x2 =
          config.node.leftOffset +
          data.x2 * config.node.gap.x +
          config.node.width +
          boxOffset.x2;
        data.y2 =
          config.node.topOffset +
          data.y2 * config.node.gap.y +
          config.node.height / 2 +
          boxOffset.y2;
        if (data.startIndex[1] == 1) {
          data.y1 = data.y2;
        } else {
          data.y1 =
            config.node.topOffset +
            data.y1 * config.node.gap.y +
            config.node.height / 2;
        }
      } else {
        if (data.terminals[0] == "down" || data.terminals[0] == "up") {
          data.terminals[0] == "up" ? (dy0 = 0) : (dy0 = 1);
          data.x1 =
            config.node.leftOffset +
            data.x1 * config.node.gap.x +
            config.node.width / 2 +
            boxOffset.x1;
          data.y1 =
            config.node.topOffset +
            data.y1 * config.node.gap.y +
            config.node.height * dy0 +
            boxOffset.y1;
        }

        if (data.terminals[0] == "right" || data.terminals[0] == "left") {
          data.terminals[0] == "right" ? (dx0 = 1) : (dx0 = 0);
          data.y1 =
            config.node.topOffset +
            data.y1 * config.node.gap.y +
            config.node.height / 2 +
            boxOffset.y1;
          data.x1 =
            config.node.leftOffset +
            data.x1 * config.node.gap.x +
            config.node.width * dx0 +
            boxOffset.x1;
        }

        if (data.terminals[1] == "down" || data.terminals[1] == "up") {
          let dy1;
          data.terminals[1] == "up" ? (dy1 = 0) : (dy1 = 1);
          data.x2 =
            config.node.leftOffset +
            data.x2 * config.node.gap.x +
            config.node.width / 2 +
            boxOffset.x2;
          data.y2 =
            config.node.topOffset +
            data.y2 * config.node.gap.y +
            config.node.height * dy1 +
            boxOffset.y2;
        }

        if (data.terminals[1] == "right" || data.terminals[1] == "left") {
          data.terminals[1] == "right" ? (dx1 = 1) : (dx1 = 0);
          data.y2 =
            config.node.topOffset +
            data.y2 * config.node.gap.y +
            config.node.height / 2 +
            boxOffset.y2;
          data.x2 =
            config.node.leftOffset +
            data.x2 * config.node.gap.x +
            config.node.width * dx1 +
            boxOffset.x2;
        }
      }

      straightPath = getStraightMedianPoints(data);
    }
    updatePositions();
    //set CSS classes for filters and playback
    let g = d3
      .select("#" + parent)
      .append("g")
      .attr("id", "PatentrackLink_" + data.id)
      .attr("class", () => {
        return (
          "PatentrackLink " +
          data.category.replace(" ", "") +
          " " +
          "assignment_no_" +
          data.assignment_no
        );
      })
      .attr("visibility", "visible");

    //backkground hitarea
    g.append("path")
      .attr("d", straightPath)
      .attr("stroke-width", config.link.hitArea * 2)
      .attr("stroke", "transparent")
      .attr("fill", "none")
      .attr("cursor", "pointer")
      .on("mouseover", () => {
        let dx = d3.event.offsetX + config.link.tooltip.x,
          dy = d3.event.offsetY + config.link.tooltip.y;
        d3.select("#" + parent)
          .append("text")
          .attr("id", "dummy")
          .attr("font-size", config.link.tooltip.fontSize)
          /* .text(data.category); */
          .html("<tspan dx='0rem' dy='1.1rem'>"+ data.category + "</tspan><tspan dx='-2.9rem' dy='1.1rem'>Execution: " +
                  time2String(data.line.date) +
                  '</tspan><tspan dx="-8.2rem" dy="1.1rem">' +
                  "Recorded: " +
                  time2String(data.line.recorded) +
                  "</tspan>",
          )
        let bbox = d3
          .select("#dummy")
          .node()
          .getBBox();
        d3.selectAll("#dummy").remove();

        d3.select("#" + svg)
          .append("rect")
          .attr("x", dx)
          .attr("y", dy)
          .attr("rx", config.link.tooltip.corners)
          .attr("ry", config.link.tooltip.corners)
          .attr("class", "link-tooltip")
          .attr("width", bbox.width * 1.4)
          .attr("height", bbox.height * 1.4)
          .attr("fill", config.node.background)
          .attr("stroke", config.colors[
            data.category.charAt(0).toLowerCase() +
              data.category.slice(1).replace(" ", "")
          ])
          .attr("opacity", config.node.opacity);

        d3.select("#" + svg)
          .append("text")
          .attr("x", dx + 70 )
          .attr("y", dy )
          .attr("class", "link-tooltip")
          .attr("fill", config.colors[
            data.category.charAt(0).toLowerCase() +
              data.category.slice(1).replace(" ", "")
          ])
          .attr("font-size", config.link.tooltip.fontSize)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          /* .text(data.category); */
          .html("<tspan dx='0rem' dy='1.1rem'>"+ data.category + "</tspan><tspan dx='-2.9rem' dy='1.5rem'>Execution: " +
                  time2String(data.line.date) +
                  '</tspan><tspan dx="-8.2rem" dy="1.1rem">' +
                  "Recorded: " +
                  time2String(data.line.recorded) +
                  "</tspan>",
          );
      })
      .on("mouseout", () => {
        d3.selectAll(".link-tooltip").remove();
      })
      .on("click", () => {
        //passing referenced data from json.popup and handleComment
        //comment is a handler
        //commentContent is the comment content (string or HTML (have to be parsed))
        resetAllActivePDF()
        const targetElement = d3.event.target.parentNode.querySelector(`[id*="link_"]`)
        
        targetElement.setAttribute('stroke-width',config.link.active.width)
        const element = d3.event.target.closest(
          "g#patentLinksGroup",
        )
        const allLinks = element.querySelectorAll(`[id*="link_"]`)
          
        if(allLinks != null && allLinks.length > 0) {
          [].forEach.call(allLinks, function(el) {
            if(el != targetElement) {
              el.setAttribute('stroke-width',config.link.width)
            }
          })
        }

        connectionBox(data.line, comment);
      });

    g.append("path")
      .attr("d", straightPath)
      .attr("id", "link_" + data.id)
      .attr("pointer-events", "none")
      .attr("stroke-width", config.link.width)
      .attr("stroke", data.color)
      .attr("fill", "none");

    g.append("path")
      .attr("transform", () => {
        if (data.terminals[1] == "up") {
          let increments = { x: 0, y: -4 },
            theta = 180;
          let total = d3
            .select("#" + "link_" + data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select("#" + "link_" + data.id)
            .node()
            .getPointAtLength(total);
          return (
            "translate(" +
            (p.x + increments.x) +
            "," +
            (p.y + increments.y) +
            "),rotate(" +
            theta +
            ")"
          );
        } else if (data.terminals[1] == "right") {
          let increments = { x: 4, y: 0 },
            theta = -90;
          let total = d3
            .select("#" + "link_" + data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select("#" + "link_" + data.id)
            .node()
            .getPointAtLength(total);
          return (
            "translate(" +
            (p.x + increments.x) +
            "," +
            (p.y + increments.y) +
            "),rotate(" +
            theta +
            ")"
          );
        } else if (data.terminals[1] == "left") {
          let increments = { x: -4, y: 0 },
            theta = 90;
          let total = d3
            .select("#" + "link_" + data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select("#" + "link_" + data.id)
            .node()
            .getPointAtLength(total);
          return (
            "translate(" +
            (p.x + increments.x) +
            "," +
            (p.y + increments.y) +
            "),rotate(" +
            theta +
            ")"
          );
        } else if (data.terminals[1] == "down") {
          let increments = { x: 0, y: 4 },
            theta = 0;
          let total = d3
            .select("#" + "link_" + data.id)
            .node()
            .getTotalLength();
          let p = d3
            .select("#" + "link_" + data.id)
            .node()
            .getPointAtLength(total);
          return (
            "translate(" +
            (p.x + increments.x) +
            "," +
            (p.y + increments.y) +
            "),rotate(" +
            theta +
            ")"
          );
        }
      })
      .attr(
        "d",
        d3
          .symbol()
          .type(d3.symbolTriangle)
          .size(18),
      )
      .attr("fill", data.color);
  }, []);
  return null;
}
