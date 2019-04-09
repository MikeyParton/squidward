import React from "react"
import { Group } from "@vx/group";
import { LinkHorizontal } from '@vx/shape';
import { useStore } from 'easy-peasy';
import Text from "./vxtext";
import styled from 'styled-components';
import AddNode from './AddNode';
import { NODE_HEIGHT, NODE_WIDTH, BUTTON_SPACING, MIDDLE } from './constants/dimensions';

const Overlay = styled.rect`
  width: 270px;
  height: 100px;
  rx: 15px;
  fill: transparent;
`;

const StyledAddNode = styled(AddNode)`
  display: none;
`;

const StyledNode = styled(Group)`
  &:hover {
    ${Overlay} {
      fill: grey;
    }

    ${StyledAddNode} {
      display: block;
    }
  }
`;

const StyledQuestion = styled(Group)`
  rect {
    fill: #6BF2FF;
    height: ${NODE_HEIGHT}px;
    rx: ${NODE_HEIGHT / 2}px;
    width: ${NODE_WIDTH}px;
  }

  &:hover {
    cursor: pointer;

    rect {
      fill: #62DCE8;
    }
  }
`;

const Question = (props) => {
  const { x, y, last, id } = props;
  const question = useStore(state => state.questions.getById(id));
  const links = useStore(state => state.links.linksForNode(id));

  const { display } = question;
  return (
    <StyledNode>
      <Overlay x={x + NODE_HEIGHT / 2} y={y + NODE_HEIGHT / 2} />
      {!last && (
        <LinkHorizontal
        stroke="#374469"
        strokeWidth="1"
        fill="none"
        data={{
          source: { x: y + 65, y: x + 250 },
          target: { x: y + 65, y: x + 350 }
        }} />
      )}
      <StyledQuestion top={y + BUTTON_SPACING} left={x + BUTTON_SPACING}>
        <rect />
        <Text
          verticalAnchor="start"
          lineClamp={1}
          width={NODE_WIDTH - 20}
          dx={10}
          dy={10}
        >
          {display}
        </Text>
      </StyledQuestion>
      <StyledAddNode y={y + BUTTON_SPACING} x={x} />
      <StyledAddNode x={x + MIDDLE} y={y} />
      <StyledAddNode y={y + (2 * BUTTON_SPACING)} x={x + MIDDLE} />
      <StyledAddNode x={x + (2 * MIDDLE)} y={y + BUTTON_SPACING} />
    </StyledNode>
  )
}

export default Question
