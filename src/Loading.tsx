import React, { FC } from 'react';
import { keyframes, css } from '@emotion/core';
import styled from '@emotion/styled';

const ldsElipssis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const ldsElipssis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}`;
const ldsElipssis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(33px, 0);
  }
}`;

const base = css`
  position: absolute;
  top: calc(50% - 8px);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: black;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
`;

const Child1 = styled('div')`
  ${base}
  left: 10%;
  animation: ${ldsElipssis1} 0.6s infinite;
`;
const Child2 = styled('div')`
  ${base}
  left: 10%;
  animation: ${ldsElipssis2} 0.6s infinite;
`;
const Child3 = styled('div')`
  ${base}
  left: 40%;
  animation: ${ldsElipssis2} 0.6s infinite;
`;
const Child4 = styled('div')`
  ${base}
  left: 70%;
  animation: ${ldsElipssis3} 0.6s infinite;
`;
const LoadingWrapper = styled('div')(`
  pointer-events: none;
  display: inline-block;
  position: relative;
  width: 100px;
  height: 50px;
`);

const Loading: FC = () => (
  <LoadingWrapper>
    <Child1 />
    <Child2 />
    <Child3 />
    <Child4 />
  </LoadingWrapper>
);

export default Loading;
