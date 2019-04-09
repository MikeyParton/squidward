import React from 'react';
import { useStore } from 'easy-peasy';
import Node from './Node';
import {
  HORIZONTAL_NODE_SPACING,
  VERTICAL_BRANCH_SPACING
} from './constants/dimensions';

const Branch = (props) => {
  const { id, index } = props;
  const branch = useStore(state => state.branches.getById(id));
  const offset = useStore(state => state.getBranchOffset(id));

  return branch.nodeIds.map((nodeId, nodeIndex) => (
    <Node
      id={nodeId}
      x={HORIZONTAL_NODE_SPACING * (nodeIndex + offset)}
      y={VERTICAL_BRANCH_SPACING * index}
      node={nodeId}
      last={nodeIndex === branch.nodeIds.length - 1}
    />
  ))
};

export default Branch;
