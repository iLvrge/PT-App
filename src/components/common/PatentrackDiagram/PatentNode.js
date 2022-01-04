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
      .attr('fill', this.props.node.background)
      .attr('stroke', this.props.node.border);

    g.append('text')
      .attr('dx', offsetX)
      .attr('dy', '1.1rem')
      .attr('font-size', this.props.node.headerSize)
      .attr('font-weight', this.props.node.fontWeight)
      .attr('fill', this.props.node.fontColor)
      .attr('text-rendering', 'geometricPrecision')
      .text(this.props.data.name)
      .call(
        this.multiline,
        this.props.node.width * this.props.node.maxLineLength,
        this.props.node.numberOfLines,
        this,
      );

    if (this.props.data.document != null) {
      g.append('svg:image')
        .attr('xlink:href', pdfIcon)
        .attr('width', this.props.node.pdf.size)
        .attr('height', this.props.node.pdf.size)
        .attr('x', this.props.node.pdf.x)
        .attr('y', this.props.node.pdf.y)
        .attr('cursor', 'pointer')
        .on('click', () => {
          //pdfView

          /*
                    
                    I can pass any data you want, by now
                    it's just json.box[i].document
                    
                    Please delete handlePdfView() function at App/index.js
                    I have used it just for mockup
                    
                    */

          this.props.pdfView(this.props.data.document, this.props.data.json);
        });
    }

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
        .attr('fill', this.props.node.fontColor)
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