import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import pdfIcon from './assets/pdf.svg';

class PatentNode extends React.Component {
  constructor(props_) {
    super(props_);

    this.dateFormat = d3.timeFormat('%m/%d/%Y');
  }

  componentDidMount() {
    this.drawNode();
  }

  drawNode() {
    let dx =
      this.props.node.leftOffset +
      this.props.data.x * (this.props.node.width + this.props.node.gap.x);
    let dy =
      this.props.node.topOffset +
      this.props.data.y * (this.props.node.height + this.props.node.gap.y);
    let offsetX = '0.6rem';
    let datesOffsetX = '2.2rem';

    //set CSS classes for filters and playback
    let assignment_no = Array.from(
      new Set([
        ...this.props.data.up,
        ...this.props.data.right,
        ...this.props.data.down,
        ...this.props.data.left,
      ]),
    ).map(n_ => {
      return 'assignment_no_' + n_;
    });
    let categories = Array.from(
      new Set(
        this.props.childrenLinks.map(link_ => {
          return link_.props.data.category.replace(' ', '');
        }),
      ),
    );

    let g = d3
      .select('#' + this.props.parent)
      .append('g')
      .attr('class', () => {
        return (
          'PatentrackNode ' +
          categories.join(' ') +
          ' ' +
          assignment_no.join(' ')
        );
      })
      .attr('id', () => {
        return 'PatentrackNode_' + this.props.data.id;
      })
      .attr('transform', 'translate(' + dx + ',' + dy + ')')
      .attr('visibility', 'visible')
      .attr('type', this.props.data.typeID.type)
      .attr(
        'children',
        Array.from(
          new Set(
            this.props.childrenLinks.map(link_ => {
              return link_.props.data.id + '|' + link_.props.data.category;
            }),
          ),
        ),
      )
      .on('click', () => {
        console.log(this.props.data);
      });

    g.append('rect')
      .attr('width', this.props.node.width)
      .attr('height', this.props.node.height)
      .attr('rx', this.props.data.rounded)
      .attr('ry', this.props.data.rounded)
      .attr('fill-opacity', this.props.node.opacity)
      .attr('fill', this.props.data.typeID.type == "inventors" ? this.props.node.inventor.background : this.props.node.background)
      .attr('stroke', this.props.data.typeID.type == "inventors" ? this.props.node.inventor.border : this.props.node.border);

    g.append('text')
      .attr('dx', offsetX)
      .attr('dy', '1.1rem')
      .attr('font-size', this.props.node.headerSize)
      .attr('font-weight', this.props.node.fontWeight)
      .attr('fill', this.props.data.typeID.type == "inventors" ? this.props.node.inventor.fontColor : this.props.node.fontColor)
      .attr('text-rendering', 'geometricPrecision')
      .attr('class', 'wrapText')
      .attr('title', typeof this.props.data.json != 'undefined' && typeof this.props.data.json.original_name !== 'undefined' && this.props.data.json.original_name != '' && this.props.data.json.original_name !== null ? this.props.data.json.original_name : this.props.data.name)
      .on("mouseover", () => {
        //let dx = d3.event.offsetX, dy = d3.event.offsetY
        /* let fromElement = d3.event.fromElement
        if(fromElement != null && fromElement.nodeName != 'rect') {
          const path =  d3.event.path
          if(path.length > 0) {
            const findIndex = path.findIndex( r => r.nodeName == 'g' && r.id.indexOf('PatentrackNode') !== -1)
            if(findIndex !== 1) {
              fromElement = path[findIndex].querySelector('rect')
            }
          } 
        }
        const getBoundElementRec = fromElement.getBoundingClientRect() */
        //let pos = d3.select(d3.event.fromElement).node().getBoundingClientRect();

        d3.select("#patentrackDiagramDiv")
          .append("div")	
          .attr("class", "tooltip_title MuiTooltip-tooltip")	
          .attr("style", `background: ${this.props.isDarkTheme ? this.props.themeMode.dark.palette.background.default : this.props.themeMode.light.palette.background.default};`)
          .html(typeof this.props.data.json != 'undefined' && typeof this.props.data.json.original_name !== 'undefined' && this.props.data.json.original_name != '' && this.props.data.json.original_name !== null ? this.props.data.json.original_name : this.props.data.name)
          /* .style('left', `${pos['x']}px`)
          .style('top', `${(window.pageYOffset  + pos['y'] - 100)}px`); */
          /* .style("left", `${d3.event.pageX }px`)		
          .style("top", `${d3.event.pageY }px`);	  */
          .style("left", `${d3.event.offsetX + 30}px`)		
          .style("top", `${(d3.event.offsetY)}px`);	  
      })
      .on("mouseout", () => {
        d3.selectAll(".tooltip_title").remove();
      })
      .text(this.props.data.name)
      .call(
        this.multiline,
        this.props.node.width * this.props.node.maxLineLength,
        this.props.node.numberOfLines,
        this,
      );

    /* if (data.document != null && data.document != "") {
      g.append("svg:image")
        .attr("xlink:href", Object.keys(pdfFile).length > 0 && pdfFile.document == data.document ?  config.pdfIconActive  : config.pdfIcon)
        .attr("width", node.pdf.size)
        .attr("height", node.pdf.size)
        .attr("x", node.pdf.x)
        .attr("y", node.pdf.y)
        .attr("cursor", "pointer")
        .on("click", () => {
          unsetAllActiveLink()
          const targetElement = d3.event.target
          const togglePDF = targetElement.getAttribute('href')
          console.log('togglePDF', togglePDF, targetElement)
          if( togglePDF == '' || togglePDF  == config.pdfIcon ) {
            targetElement.setAttribute('href',config.pdfIconActive)
            console.log('SET IMAGE')
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
            
            pdfView(data.json);
          } else {
            targetElement.setAttribute('href',config.pdfIcon)
            pdfView({})
          }
        });
    } */

    let executionDate =
      this.props.data.executionDate != ''
        ? this.dateFormat(new Date(this.props.data.executionDate))
        : 'N/A';
    let recordedDate =
      this.props.data.recordedDate != ''
        ? this.dateFormat(new Date(this.props.data.recordedDate))
        : 'N/A';

    let filledDate =
      this.props.data.filledDate != undefined &&
      this.props.data.filledDate != ''
        ? this.dateFormat(new Date(this.props.data.filledDate))
        : 'N/A';
    let grantedDate =
      this.props.data.grantedDate != undefined &&
      this.props.data.grantedDate != ''
        ? this.dateFormat(new Date(this.props.data.grantedDate))
        : 'N/A';

    if (this.props.data.type < 3) {
      g.append('text')
        .attr('dx', datesOffsetX)
        .attr('dy', '3.05rem')
        .attr('font-size', this.props.node.datesSize)
        .attr('fill', this.props.data.typeID.type == "inventors" ? this.props.node.inventor.fontColor : this.props.node.fontColor)
        .html(
          this.props.data.type == 0
            ? '<tspan>Filled: ' +
                filledDate +
                '</tspan><tspan x="' +
                datesOffsetX +
                '" dy="' +
                this.props.node.height * 2e-1 +
                '">' +
                'Granted: ' +
                grantedDate +
                '</tspan>'
            : '<tspan>Execution: ' +
                executionDate +
                '</tspan><tspan x="' +
                datesOffsetX +
                '" dy="' +
                this.props.node.height * 2e-1 +
                '">' +
                'Recorded: ' +
                recordedDate +
                '</tspan>',
        );
    }
  }

  multiline(text_, width_, lines_, parent_) {
    let lineCount = 0;

    text_.each(function() {
      let text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = parent_.props.node.headerSize,
        y = text.attr('y'),
        dy = parseFloat(text.attr('dy')),
        tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', text.attr('dy'));

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));

        if (tspan.node().getComputedTextLength() > width_) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          /* if (lineCount < lines_ - 1) {
            tspan = text
              .append('tspan')
              .attr('x', text_.attr('dx'))
              .attr('y', y)
              .attr('dy', lineHeight)
              .text(word);
          } */
          tspan = text
            .append("tspan")
            .attr("x", text_.attr("dx"))
            .attr("y", y)
            .attr("dy", lineHeight + 1)
            .text(word);

          lineCount++;
        }
      }
    });
  }

  render() {
    return null;
  }
}

export default PatentNode;