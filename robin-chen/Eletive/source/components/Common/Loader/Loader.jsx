import React from 'react';
import styled, { keyframes } from 'styled-components';

const distance = [1, 3, 5];

const propagate = [
  keyframes`
      25% {transform: translateX(-${distance[0]}rem) scale(0.75)}
      50% {transform: translateX(-${distance[1]}rem) scale(0.6)}
      75% {transform: translateX(-${distance[2]}rem) scale(0.5)}
      95% {transform: translateX(0rem) scale(1)}
    `,
  keyframes`
      25% {transform: translateX(-${distance[0]}rem) scale(0.75)}
      50% {transform: translateX(-${distance[1]}rem) scale(0.6)}
      75% {transform: translateX(-${distance[1]}rem) scale(0.6)}
      95% {transform: translateX(0rem) scale(1)}
    `,
  keyframes`
      25% {transform: translateX(-${distance[0]}rem) scale(0.75)}
      75% {transform: translateX(-${distance[0]}rem) scale(0.75)}
      95% {transform: translateX(0rem) scale(1)}
    `,
  keyframes`
      25% {transform: translateX(${distance[0]}rem) scale(0.75)}
      75% {transform: translateX(${distance[0]}rem) scale(0.75)}
      95% {transform: translateX(0rem) scale(1)}
    `,
  keyframes`
      25% {transform: translateX(${distance[0]}rem) scale(0.75)}
      50% {transform: translateX(${distance[1]}rem) scale(0.6)}
      75% {transform: translateX(${distance[1]}rem) scale(0.6)}
      95% {transform: translateX(0rem) scale(1)}
    `,
  keyframes`
      25% {transform: translateX(${distance[0]}rem) scale(0.75)}
      50% {transform: translateX(${distance[1]}rem) scale(0.6)}
      75% {transform: translateX(${distance[2]}rem) scale(0.5)}
      95% {transform: translateX(0rem) scale(1)}
    `,
];

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
  position: relative;
`;

const Dot = styled.div`
  position: absolute;
  // font-size = width / 3
  font-size: 5px;
  width: 15px;
  height: 15px;
  background: #98A6BC;
  border-radius: 50%;
  animation: ${props => propagate[props.index]} 1.5s infinite;
  animation-fill-mode: forwards;
`;

export const Loader = () => (
  <Container>
    <Wrapper>
      <Dot index={0} />
      <Dot index={1} />
      <Dot index={2} />
      <Dot index={3} />
      <Dot index={4} />
      <Dot index={5} />
    </Wrapper>
  </Container>
);
