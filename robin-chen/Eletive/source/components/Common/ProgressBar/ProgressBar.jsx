import React from 'react';
import styled from 'styled-components';

const stripe = 'rgba(255, 255, 255, 0.22)';

const Meter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  background: linear-gradient(-45deg, ${stripe} 10%, transparent 25%, transparent 50%,
    ${stripe} 50%, ${stripe} 75%, transparent 75%);
  background-color: #74f4a1;
  background-size: 30px 30px;
  transition: width 200ms cubic-bezier(0.4, 1, 0.75, 0.9);
`;

const ProgressBar = ({ className }) => (
  <div className={className}>
    <Meter />
  </div>
);


const StyledProgressBar = styled(ProgressBar)`
  position: relative;
  display: block;
  width: 100%;
  height: 32px;
  overflow: hidden;
  border-radius: 40px;
  background: linear-gradient(90deg, #74f4a1 0.14%, #62d382 126.83%);
￼`;

export { StyledProgressBar as ProgressBar };
