import React, { FC } from 'react';
import { keyframes } from '@emotion/core';
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
    transform: translate(24px, 0);
  }
}`;

const Child1 = styled('div')`
  left: 8px;
  animation: ${ldsElipssis1} 0.6s infinite;
`;
const Child2 = styled('div')`
  left: 8px;
  animation: ${ldsElipssis2} 0.6s infinite;
`;
const Child3 = styled('div')`
  left: 32px;
  animation: ${ldsElipssis2} 0.6s infinite;
`;
const Child4 = styled('div')`
  left: 56px;
  animation: ${ldsElipssis3} 0.6s infinite;
`;
const LoadingWrapper = styled('div')`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  
  > div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
`;


const Loading: FC = () => <LoadingWrapper><Child1 /><Child2 /><Child3 /><Child4 /></LoadingWrapper>;

export default Loading;
