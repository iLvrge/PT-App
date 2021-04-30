import { useEffect } from "react";
import moment from "moment";
import * as d3 from "d3";

const time2String = dateStr => moment(dateStr).format("MM/DD/YYYY");
function wrapText(str, width, lines, node) {
  let lineCount = 0;
  
  str.each(function() {
    let text = d3.select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineHeight = node.headerSize,
      y = text.attr("y"),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", text.attr("dy"));
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
            .append("tspan")
            .attr("x", str.attr("dx"))
            .attr("y", y)
            .attr("dy", lineHeight + 1)
            .text(word);
        /* if (lineCount < lines - 1) { 
          
        } */

        lineCount++;
      }
    }
  });
}



export default function PatentNode(props) {
  const { node, data, config, childrenLinks, parent, pdfView } = props;
  
  function unsetAllActiveLink() {
    const element = document.querySelector(
      "g#patentLinksGroup",
    )
    const allLink = element.querySelectorAll(`[id*="link_"]`)
      
    if(allLink != null && allLink.length > 0) {
      [].forEach.call(allLink, function(el) {
        el.setAttribute('stroke-width',config.link.width)
      })
    }
  }
  
  useEffect(() => {
    let dx = node.leftOffset + data.x * node.gap.x;
    let dy = node.topOffset + data.y * node.gap.y;
    let offsetX = "0.6rem";
    let datesOffsetX = "2.2rem";

    //set CSS classes for filters and playback
    let assignment_no = Array.from(
      new Set([...data.up, ...data.right, ...data.down, ...data.left]),
    ).map(n_ => "assignment_no_" + n_);
    let categories = Array.from(
      new Set(
        childrenLinks.map(link_ => link_.props.data.category.replace(" ", "")),
      ),
    );

    let g = d3
      .select("#" + parent)
      .append("g")
      .attr(
        "class",
        () =>
          "PatentrackNode " +
          categories.join(" ") +
          " " +
          assignment_no.join(" "),
      )
      .attr("id", "PatentrackNode_" + data.id)
      .attr("transform", "translate(" + dx + "," + dy + ")")
      .attr("visibility", "visible")
      .attr("type", data.typeID.type)
      .attr(
        "children",
        Array.from(
          new Set(
            childrenLinks.map(
              link_ => link_.props.data.id + "|" + link_.props.data.category,
            ),
          ),
        ),
      );

    g.append("rect")
      .attr("width", node.width)
      .attr("height", node.height)
      .attr("rx", data.rounded)
      .attr("ry", data.rounded)
      .attr("fill-opacity", node.opacity)
      .attr("fill", node.background)
      .attr("stroke", node.border);

    g.append("text")
      .attr("dx", offsetX)
      .attr("dy", "1.1rem")
      .attr("font-size", node.headerSize)
      .attr("font-weight", node.fontWeight)
      .attr("fill", node.fontColor)
      .attr("text-rendering", "geometricPrecision")
      .attr('class', 'wrapText')
      .attr('title', data.name)
      .on("mouseover", () => {
        let dx = d3.event.offsetX, dy = d3.event.offsetY
        const fromElement = d3.event.fromElement
        const getBoundElementRec = fromElement.getBoundingClientRect()
        d3.select("#patentrackDiagramDiv")
          .append("div")	
          .attr("class", "tooltip_title")	
          .html(data.name)
          .style("left", (getBoundElementRec.left - 240) + "px")		
          .style("top", (getBoundElementRec.top - 44) + "px");	
      })
      .on("mouseout", () => {
        d3.selectAll(".tooltip_title").remove();
      })
      .text(data.name) 
      .call(
        wrapText,
        node.width * node.maxLineLength,
        node.numberOfLines,
        node,
      );

    if (data.document != null && data.document != "") {
      g.append("svg:image")
        .attr("xlink:href", config.pdfIcon)
        .attr("width", node.pdf.size)
        .attr("height", node.pdf.size)
        .attr("x", node.pdf.x)
        .attr("y", node.pdf.y)
        .attr("cursor", "pointer")
        .on("click", () => {
          unsetAllActiveLink()
          const targetElement = d3.event.target
          targetElement.setAttribute('href',config.pdfIconActive)
          const element = d3.event.target.closest(
            "g#patentNodesGroup",
          )
          const images = element.querySelectorAll('image')
          
          if(images != null && images.length > 0) {
            [].forEach.call(images, function(el) {
              if(el != targetElement) {
                el.setAttribute('href',config.pdfIcon)
              }
            })
          }
           
          //pdfView
          /*  
          I can pass any data you want, by now
          it's just json.box[i].document
          
          Please delete handlePdfView() function at App/index.js
          I have used it just for mockup
          
          */
          pdfView(data.json);
        });
    }

    let executionDate =
      data.executionDate != "" ? time2String(data.executionDate) : "N/A";
    let recordedDate =
      data.recordedDate != "" ? time2String(data.recordedDate) : "N/A";

    let executionHTML =
      data.flag == "0" ? "Execution: " + executionDate : "&nbsp;";

    let filledDate =
      data.filledDate != undefined && data.filledDate != ""
        ? time2String(data.filledDate)
        : "N/A";
    let grantedDate =
      data.grantedDate != undefined && data.grantedDate != ""
        ? time2String(data.grantedDate)
        : "N/A";

    if (data.type < 3) {
      g.append("text")
        .attr("dx", datesOffsetX)
        .attr("dy", "3.05rem")
        .attr("font-size", node.datesSize)
        .attr("fill", node.fontColor)
        .html(
          data.type == 0
            ? "<tspan>Filled: " +
                filledDate +
                '</tspan><tspan x="' +
                datesOffsetX +
                '" dy="' +
                node.height * 2e-1 +
                '">' +
                "Granted: " +
                grantedDate +
                "</tspan>"
            : "<tspan>" +
                executionHTML +
                '</tspan><tspan x="' +
                datesOffsetX +
                '" dy="' +
                node.height * 2e-1 +
                '">' +
                "Recorded: " +
                recordedDate +
                "</tspan>",
        );
    }
  }, []);
  return null;
}
