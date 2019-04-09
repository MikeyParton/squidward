import React from 'react';
import Question from './Question';
import { useStore } from 'easy-peasy';

const mapping = {
  question: Question
};

const Node = (props) => {
  const { id, ...rest } = props;
  const node = useStore(state => state.nodes.getById(id));
  const NodeComponent = mapping[node.elementType];
  return (
    <NodeComponent id={node.elementId} {...rest} />
  )
};

export default Node;
