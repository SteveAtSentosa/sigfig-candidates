import styled from 'styled-components';
import { SvgImage } from '../SvgImage/SvgImage';

export const ToggleRoot = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 12px;
  background: ${props => (props.checked ?
    'linear-gradient(270deg, #74f4a1 0%, #62d382 100%)'
    : 'linear-gradient(270deg, #ffac9c 0%, #dd8478 100%)')};
  direction: ltr;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  text-align: left;
  touch-action: none;
  transition: opacity .25s;
  user-select: none;
`;

export const ToggleBackground = styled.div`
  position: relative;
  width: 42px;
  height: 24px;
  margin: 0;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: ${props => (props.isDragging ? null : 'background .25s')};

  &:hover, input[type="checkbox"]:focus + & {
    border: 1px solid rgba(53, 74, 96, 0.5);
  }
`;

export const ToggleHandle = styled.div`
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(${props => props.position}px, -50%);
  background: #ffffff;
  height: 18px;
  width: 18px;
  border: 0;
  border-radius: 50%;
  outline: 0;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: ${props => (props.isDragging ? null : 'background-color .25s, transform .25s, box-shadow .15s')};
`;

export const ToggleInput = styled.input`
  position: absolute;
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`;

export const ToggleIconChecked = styled(SvgImage)`
  display: flex;
  align-items: center;
  position: absolute;
  left: 7px;
  height: 12px;
  width: 10px;
  top: 50%;
  color: #ffffff;
  transform: translateY(-50%);
  opacity: ${props => props.opacity};
  pointer-events: none;
  transition: ${props => (props.isDragging ? null : 'opacity .25s')};
`;

export const ToggleIconUnchecked = styled(SvgImage)`
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  color: #ffffff;
  height: 12px;
  width: 3px;
  pointer-events: none;
  opacity: ${props => props.opacity};
  transition: ${props => (props.isDragging ? null : 'opacity .25s')};
`;
