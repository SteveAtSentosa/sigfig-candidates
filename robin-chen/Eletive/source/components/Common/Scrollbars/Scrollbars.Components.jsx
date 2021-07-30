import React from 'react';
import styled from 'styled-components';
import { Scrollbar as ReactCustomScrollbars } from 'react-scrollbars-custom';

const Container = ({ rightY, children, ...props }) => (
  <ReactCustomScrollbars {...props}>{children}</ReactCustomScrollbars>
);

export const ScrollbarContainer = styled(Container)`
  width: 100%;
  height: 100%;

  & > .ScrollbarsCustom-Wrapper {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    & > .ScrollbarsCustom-Scroller {
      & > .ScrollbarsCustom-Content {
      }
    }
  }

  .ScrollbarsCustom-Track {
    position: absolute;
    border-radius: 0.25rem;
  }

  .ScrollbarsCustom-Thumb {
    background: rgba(255, 255, 255, 0.12);
    cursor: pointer;
    border-radius: 0.25rem;

    &:hover,
    &.dragging {
      background: #9ed6ff;
    }
  }

  .ScrollbarsCustom-ThumbY {
    width: 100%;
    height: 120px;
    cursor: pointer;
    border-radius: 1px;
    background: rgba(0, 0, 0, 0.4);

  }

  .ScrollbarsCustom-ThumbX {
    height: 100%;
  }

  .ScrollbarsCustom-TrackY {
    position: absolute;
    overflow: hidden;
    border-radius: 1px;
    background: rgba(0, 0, 0, 0.1);
    user-select: none;
    width: 2px;
    height: calc(100% - 20px);
    top: 10px;
    right: ${props => props.rightY}px;
  }

  .ScrollbarsCustom-TrackX {
    height: 1rem;
    width: calc(100% - 3rem);
    bottom: 0.5rem;
    left: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
  }

  &.trackYVisible {
    & > .ScrollbarsCustom-Wrapper {
      right: 10px;
    }

    & > .ScrollbarsCustom-TrackX {
      width: calc(100% - 4rem);
      left: 2rem;
    }
  }

  &.trackXVisible {
    &:hover {
      .ScrollbarsCustom-TrackX {
        background: #373737;
      }

      .ScrollbarsCustom-ThumbX {
        background: #4f4f4f;

        &:hover,
        &.dragging {
          background: #9ed6ff;
        }
      }
    }
  }
`;


ScrollbarContainer.defaultProps = {
  rightY: 10,
};
