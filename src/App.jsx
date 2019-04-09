import React from 'react';
import Branch from './Branch'
import Link from './Link';
import { useStore } from 'easy-peasy';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
html, body {
    box-sizing: border-box;
    font-family: lato;
    font-size: 14px;
    margin: 0;
    text-size-adjust: 100%;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;

const Page = styled.div`
  position: relative;

  svg {
    margin: 20px;
    margin-left: 320px;
    height: 1000px;
    width: 2000px;
  }
`;

const Editor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  background-color: grey;
  padding: 10px;
`;

const MyGraph = () => {
  const branchIds = useStore(state => state.branches.ids);
  const linkIds = useStore(state => state.links.ids);
  return (
    <Page>
      <GlobalStyles />
      <Editor>
        <h1>Editor</h1>
      </Editor>
      <svg>
        {linkIds.map((id, index) => <Link id={id} />)}
        {branchIds.map((id, index) => (
          <Branch id={id} index={index} />)
        )}
      </svg>
    </Page>
  )
};

export default MyGraph;
