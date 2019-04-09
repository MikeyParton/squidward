import React from 'react';
import { useStore } from 'easy-peasy';
import { LinkVerticalLine, LinkHorizontal, LinkVerticalStep } from '@vx/shape';
import {
  NODE_HEIGHT,
  HORIZONTAL_NODE_SPACING,
  VERTICAL_BRANCH_SPACING
} from './constants/dimensions';

const yForBranch = index => 65 + (NODE_HEIGHT / 2) + (index * (VERTICAL_BRANCH_SPACING - NODE_HEIGHT));
const xForNode = index =>  + ((index + 0.5) * HORIZONTAL_NODE_SPACING)

const Link = (props) => {
  const { id } = props;
  const link = useStore(state => state.links.getById(id));
  const source = useStore(state => state.nodes.getById(link.source));
  const target = useStore(state => state.nodes.getById(link.target));

  const sourceNodeIndex = useStore(state => state.getNodeIndex(link.source));
  const sourceBranchIndex = useStore(state => state.branches.getBranchIndex(source.branchId));
  const targetNodeIndex = useStore(state => state.getNodeIndex(link.target));
  const targetBranchIndex = useStore(state => state.branches.getBranchIndex(target.branchId));

  const sourceOffset = useStore(state => state.getBranchOffset(source.branchId));
  const targetOffset = useStore(state => state.getBranchOffset(target.branchId));

  console.log(targetOffset);

  return (
    <LinkVerticalLine
      stroke="#374469"
      strokeWidth="1"
      fill="none"
      data={{
        source: { y: yForBranch(sourceBranchIndex), x: xForNode(sourceNodeIndex) + (sourceOffset * HORIZONTAL_NODE_SPACING) },
        target: { y: yForBranch(targetBranchIndex), x: xForNode(targetNodeIndex) + (targetOffset * HORIZONTAL_NODE_SPACING) }
      }}
    />
  )
};

export default Link
