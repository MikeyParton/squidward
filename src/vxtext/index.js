import PropTypes from 'prop-types';
import React, { Component } from 'react';
import reduceCSSCalc from 'reduce-css-calc';
import getStringWidth from './util/getStringWidth';
import truncateWord from './util/truncateWord';

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordsByLines: []
    };
  }

  componentWillMount() {
    this.updateWordsByLines(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    const needCalculate =
      this.props.children !== nextProps.children || this.props.style !== nextProps.style;
    this.updateWordsByLines(nextProps, needCalculate);
  }

  updateWordsByLines(props, needCalculate) {
    // Only perform calculations if using features that require them (multiline, scaleToFit)
    if (props.width || props.scaleToFit) {
      if (needCalculate) {
        const words = props.children ? props.children.toString().split(/\s+/) : [];

        this.wordsWithComputedWidth = words.map(word => ({
          word,
          width: getStringWidth(word, props.style)
        }));
        this.spaceWidth = getStringWidth('\u00A0', props.style);
      }

      const wordsByLines = this.calculateWordsByLines(
        this.wordsWithComputedWidth,
        this.spaceWidth,
        props.width
      );
      this.setState({ wordsByLines });
    } else {
      this.updateWordsWithoutCalculate(props);
    }
  }

  updateWordsWithoutCalculate(props) {
    const words = props.children ? props.children.toString().split(/\s+/) : [];
    this.setState({ wordsByLines: [{ words }] });
  }

  calculateWordsByLines(wordsWithComputedWidth, spaceWidth, lineWidth) {
    const { lineClamp, scaleToFit, style, truncateText } = this.props;
    const truncateTextWidth = getStringWidth(truncateText, style);
    return wordsWithComputedWidth.reduce((result, { word, width }) => {
      const currentLine = result[result.length - 1];
      const spaceAfterWord =
        lineClamp && result.length + 1 > lineClamp ? spaceWidth + truncateTextWidth : spaceWidth;

      // Skip if the result exceeds the lineClamp limit
      if (lineClamp && result.length > lineClamp) {
        return result;
      }

      if (
        currentLine &&
        (lineWidth == null || scaleToFit || currentLine.width + width + spaceAfterWord < lineWidth)
      ) {
        // Word can be added to an existing line
        currentLine.words.push(word);
        currentLine.width += width + spaceWidth;
      } else {
        // Add word to the next line
        let newLine = { words: [word], width };
        // But if it would exceed the line clamp limit, truncate and add to existing line
        if (lineClamp && result.length + 1 > lineClamp) {
          const truncatedWord = truncateWord(
            word,
            lineWidth - currentLine.width,
            truncateText,
            style
          );
          currentLine.words.push(truncatedWord.word);
          currentLine.width += truncatedWord.width;
          newLine = { words: [], width: 0 };
        }
        result.push(newLine);
      }

      return result;
    }, []);
  }

  render() {
    const {
      dx,
      dy,
      textAnchor,
      verticalAnchor,
      scaleToFit,
      angle,
      lineHeight,
      capHeight,
      innerRef,
      ...textProps
    } = this.props;
    const { wordsByLines } = this.state;

    const { x, y } = textProps;

    let startDy;
    switch (verticalAnchor) {
      case 'start':
        startDy = reduceCSSCalc(`calc(${capHeight})`);
        break;
      case 'middle':
        startDy = reduceCSSCalc(
          `calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`
        );
        break;
      default:
        startDy = reduceCSSCalc(`calc(${wordsByLines.length - 1} * -${lineHeight})`);
        break;
    }

    const transforms = [];
    if (scaleToFit && wordsByLines.length) {
      const lineWidth = wordsByLines[0].width;
      const sx = this.props.width / lineWidth;
      const sy = sx;
      const originX = x - sx * x;
      const originY = y - sy * y;
      transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`);
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }
    if (transforms.length) {
      textProps.transform = transforms.join(' ');
    }

    return (
      <svg
        ref={innerRef}
        x={dx}
        y={dy}
        fontSize={textProps.fontSize}
        style={{ overflow: 'visible' }}
      >
        <text {...textProps} textAnchor={textAnchor}>
          {wordsByLines.map((line, index) => (
            <tspan x={x} dy={index === 0 ? startDy : lineHeight} key={index}>
              {line.words.join(' ')}
            </tspan>
          ))}
        </text>
      </svg>
    );
  }
}

Text.defaultProps = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  lineHeight: '1em',
  capHeight: '0.71em', // Magic number from d3
  scaleToFit: false,
  textAnchor: 'start',
  truncateText: '...',
  verticalAnchor: 'end' // default SVG behavior
};

Text.propTypes = {
  scaleToFit: PropTypes.bool,
  angle: PropTypes.number,
  textAnchor: PropTypes.oneOf(['start', 'middle', 'end', 'inherit']),
  verticalAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
  style: PropTypes.object,
  innerRef: PropTypes.func,
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dx: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  capHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineClamp: PropTypes.number,
  truncateText: PropTypes.string,
  width: PropTypes.number
};

export default Text;
