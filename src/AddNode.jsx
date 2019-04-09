import React from 'react'
import { Group } from '@vx/group';
import Text from './vxtext';
import styled from 'styled-components';
import { NODE_HEIGHT } from './constants/dimensions';

const StyledAddNode = styled(Group)`
  rect {
    fill: #60D394;
    height: ${NODE_HEIGHT}px;
    rx: ${NODE_HEIGHT / 2}px;
    width: ${NODE_HEIGHT}px;
  }

  &:hover {
    cursor: pointer;

    rect {
      fill: #58C087;
    }
  }
`

const Question = (props) => {
  const { x, y, className } = props;
  return (
    <StyledAddNode className={className} top={y} left={x}>
      <rect />
      <Text verticalAnchor="start" dx={10} dy={8.5}>
        +
      </Text>
    </StyledAddNode>
  )
}

export default Question
