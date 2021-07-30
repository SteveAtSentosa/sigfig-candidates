/* refactored copy of https://github.com/alexkatz/react-tiny-popover 2020-01-16 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import * as Models from 'Models/index';

import { PopoverPortal } from './PopoverPortal';

export const PopoverPosition = {
  TOP: 'top',
  RIGHT: 'right',
  LEFT: 'left',
  BOTTOM: 'bottom',
};

export const PopoverAlign = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
};

const Constants = {
  DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0,
  },
};

const arrayUnique = array => array.filter((value, index, self) => self.indexOf(value) === index);

const rectsAreEqual = (rectA, rectB) => rectA === rectB ||
  (rectA?.bottom === rectB?.bottom &&
  rectA?.height === rectB?.height &&
  rectA?.left === rectB?.left &&
  rectA?.right === rectB?.right &&
  rectA?.top === rectB?.top &&
  rectA?.width === rectB?.width);

const popoverInfosAreEqual = (infoA, infoB) => infoA === infoB ||
  (infoA?.align === infoB?.align &&
  infoA?.nudgedLeft === infoB?.nudgedLeft &&
  infoA?.nudgedTop === infoB?.nudgedTop &&
  rectsAreEqual(infoA?.popoverRect, infoB?.popoverRect) &&
  rectsAreEqual(infoA?.targetRect, infoB?.targetRect) &&
  infoA?.position === infoB?.position);

const targetPositionHasChanged = (oldTargetRect, newTargetRect) => oldTargetRect === null
  || oldTargetRect.left !== newTargetRect.left
  || oldTargetRect.top !== newTargetRect.top
  || oldTargetRect.width !== newTargetRect.width
  || oldTargetRect.height !== newTargetRect.height;


export class Popover extends React.Component {
  target = null;

  targetRect = null;

  targetPositionIntervalHandler = null;

  popoverDiv = null;

  // TODO: potentially move this inside of PopoverPortal?
  positionOrder = null;

  static propTypes = {
    isOpen: PropTypes.bool,
    disableReposition: PropTypes.bool,
    align: PropTypes.string,
    position: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    contentLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    padding: PropTypes.number,
    windowBorderPadding: PropTypes.number,
    transitionDuration: PropTypes.number,
    containerStyle: PropTypes.object,
    // NOTE: Do we need to specify contentDestination? By default it's body
    contentDestination: PropTypes.element,
    content: Models.Common.RenderableElement,
    children: Models.Common.RenderableElement,
    onClickOutside: PropTypes.func,
  }

  static defaultProps = {
    align: PopoverAlign.CENTER,
    padding: 6,
    position: ['top', 'right', 'left', 'bottom'],
    windowBorderPadding: 2,
  }


  constructor(props) {
    super(props);

    this.state = {
      popoverInfo: null,
    };

    this.willUnmount = false;
    this.willMount = true;
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.willMount = false;
    });
    const { position, isOpen } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    this.target = findDOMNode(this);
    this.positionOrder = this.getPositionPriorityOrder(position);
    this.updatePopover(isOpen);
  }

  componentDidUpdate(prevProps) {
    if (this.target == null) {
      // eslint-disable-next-line react/no-find-dom-node
      this.target = findDOMNode(this);
    }

    const {
      isOpen: prevIsOpen,
      align: prevAlign,
      position: prevPosition,
    } = prevProps;
    const { isOpen, position, align, contentDestination } = this.props;

    this.positionOrder = this.getPositionPriorityOrder(position);

    if (
      prevIsOpen !== isOpen ||
      prevAlign !== align ||
      prevPosition !== position ||
      prevProps.contentDestination !== contentDestination
    ) {
      this.updatePopover(isOpen);
    }
  }

  componentWillUnmount() {
    this.willUnmount = true;
    window.clearInterval(this.targetPositionIntervalHandler);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('click', this.onClick);
    this.removePopover();
  }

  getNudgedPopoverPosition({ top, left, width, height }) {
    const { windowBorderPadding: padding } = this.props;
    let nudgedTop = top < padding ? padding : top;
    nudgedTop = nudgedTop + height > window.innerHeight - padding ? window.innerHeight - padding - height : nudgedTop;
    let nudgedLeft = left < padding ? padding : left;
    nudgedLeft = nudgedLeft + width > window.innerWidth - padding ? window.innerWidth - padding - width : nudgedLeft;
    return {
      nudgedTop,
      nudgedLeft,
    };
  }

  onResize = () => {
    this.renderPopover();
  };

  onClick = (e) => {
    const { onClickOutside, isOpen } = this.props;
    if (!this.willUnmount
      && !this.willMount
      && !this.popoverDiv.contains(e.target)
      && !this.target.contains(e.target)
      && onClickOutside && isOpen
    ) {
      onClickOutside(e);
    }
  };

  getLocationForPosition(position, newTargetRect, popoverRect) {
    const { padding, align } = this.props;
    const targetMidX = newTargetRect.left + (newTargetRect.width / 2);
    const targetMidY = newTargetRect.top + (newTargetRect.height / 2);
    let resultTop;
    let resultLeft;

    switch (position) {
      case 'top':
        resultTop = newTargetRect.top - popoverRect.height - padding;
        resultLeft = targetMidX - (popoverRect.width / 2);
        if (align === 'start') {
          resultLeft = newTargetRect.left;
        }
        if (align === 'end') {
          resultLeft = newTargetRect.right - popoverRect.width;
        }
        break;
      case 'left':
        resultTop = targetMidY - (popoverRect.height / 2);
        resultLeft = newTargetRect.left - padding - popoverRect.width;
        if (align === 'start') {
          resultTop = newTargetRect.top;
        }
        if (align === 'end') {
          resultTop = newTargetRect.bottom - popoverRect.height;
        }
        break;
      case 'bottom':
        resultTop = newTargetRect.bottom + padding;
        resultLeft = targetMidX - (popoverRect.width / 2);
        if (align === 'start') {
          resultLeft = newTargetRect.left;
        }
        if (align === 'end') {
          resultLeft = newTargetRect.right - popoverRect.width;
        }
        break;
      case 'right':
        resultTop = targetMidY - (popoverRect.height / 2);
        resultLeft = newTargetRect.right + padding;
        if (align === 'start') {
          resultTop = newTargetRect.top;
        }
        if (align === 'end') {
          resultTop = newTargetRect.bottom - popoverRect.height;
        }
        break;
      default:
        throw new Error('Wrong position value');
    }

    return {
      top: resultTop,
      left: resultLeft,
    };
  }

  getPositionPriorityOrder(position) {
    if (position && typeof position !== 'string') {
      if (Constants.DEFAULT_POSITIONS.every(
        defaultPosition => position.find(p => p === defaultPosition) !== undefined,
      )) {
        return arrayUnique(position);
      }
      const remainingPositions = Constants.DEFAULT_POSITIONS
        .filter(defaultPosition => position.find(p => p === defaultPosition) === undefined);
      return arrayUnique([...position, ...remainingPositions]);
    } if (position && typeof position === 'string') {
      const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => defaultPosition !== position);
      return arrayUnique([position, ...remainingPositions]);
    }
    return null;
  }

  removePopover() { // this should now be a callback to handle event listening upon portal disappearance
    const { isOpen } = this.props;
    if (this.willUnmount || !isOpen || !this.popoverDiv.parentNode) {
      window.clearInterval(this.targetPositionIntervalHandler);
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('click', this.onClick);
      this.targetPositionIntervalHandler = null;
    }
  }

  startTargetPositionListener(checkInterval) {
    if (this.targetPositionIntervalHandler === null) {
      this.targetPositionIntervalHandler = window.setInterval(() => {
        const newTargetRect = this.target.getBoundingClientRect();
        if (targetPositionHasChanged(this.targetRect, newTargetRect)) {
          this.renderPopover();
        }
        this.targetRect = newTargetRect;
      }, checkInterval);
    }
  }

  updatePopover(isOpen) {
    if (isOpen && this.target != null) {
      if (!this.popoverDiv || !this.popoverDiv.parentNode) {
        this.popoverDiv = this.createContainer();
      }
      window.addEventListener('resize', this.onResize);
      window.addEventListener('click', this.onClick);
      this.renderPopover();
    } else {
      this.removePopover();
    }
  }

  createContainer() {
    const { containerStyle } = this.props;
    const container = window.document.createElement('div');

    // NOTE: Increased from 10 for overweight blueprint
    container.style.zIndex = '20';

    if (containerStyle) {
      Object.keys(containerStyle)
        .forEach((key) => {
          container.style[key] = (containerStyle)[key];
        });
    }

    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.display = 'flex';

    return container;
  }

  renderPopover(positionIndex = 0) {
    if (positionIndex >= this.positionOrder.length) {
      return;
    }

    this.renderWithPosition({
      position: this.positionOrder[positionIndex],
      targetRect: this.target.getBoundingClientRect(),
    }, (violation, rect) => {
      const { disableReposition, contentLocation, align, contentDestination } = this.props;

      if (violation && !disableReposition && !(typeof contentLocation === 'object')) {
        this.renderPopover(positionIndex + 1);
      } else {
        const { nudgedTop, nudgedLeft } = this.getNudgedPopoverPosition(rect);
        const { top: rectTop, left: rectLeft } = rect;
        const position = this.positionOrder[positionIndex];
        let { top, left } = disableReposition ? {
          top: rectTop,
          left: rectLeft,
        } : {
          top: nudgedTop,
          left: nudgedLeft,
        };

        let calculatedLeft = 0;
        let calculatedTop = 0;

        if (contentLocation) {
          const targetRect = this.target.getBoundingClientRect();
          const popoverRect = this.popoverDiv.getBoundingClientRect();
          ({
            top,
            left,
          } = typeof contentLocation === 'function' ? contentLocation({
            targetRect,
            popoverRect,
            position,
            align,
            nudgedLeft,
            nudgedTop,
          }) : contentLocation);
          calculatedLeft = left;
          calculatedTop = top;
        } else {
          let destinationTopOffset = 0;
          let destinationLeftOffset = 0;

          if (contentDestination) {
            const destRect = contentDestination.getBoundingClientRect();
            destinationTopOffset = -destRect.top;
            destinationLeftOffset = -destRect.left;
          }

          const [absoluteTop, absoluteLeft] = [top + window.pageYOffset, left + window.pageXOffset];
          const finalLeft = absoluteLeft + destinationTopOffset;
          const finalTop = absoluteTop + destinationLeftOffset;

          calculatedLeft = finalLeft;
          calculatedTop = finalTop;
        }

        this.popoverDiv.style.left = `${calculatedLeft.toFixed()}px`;
        this.popoverDiv.style.top = `${calculatedTop.toFixed()}px`;
        this.popoverDiv.style.width = null;
        this.popoverDiv.style.height = null;
        this.popoverDiv.style.maxWidth = 'calc(100vw - 10px)';
        this.popoverDiv.style.maxHeight = `calc(100vh - ${(calculatedTop + 10).toFixed()}px)`;

        this.renderWithPosition({
          position,
          nudgedTop: nudgedTop - rect.top,
          nudgedLeft: nudgedLeft - rect.left,
          targetRect: this.target.getBoundingClientRect(),
          popoverRect: this.popoverDiv.getBoundingClientRect(),
        }, () => {
          this.startTargetPositionListener(10);
        });
      }
    });
  }

  renderWithPosition(params, callback) {
    const {
      position,
      nudgedLeft = 0,
      nudgedTop = 0,
    } = params;
    let {
      targetRect = Constants.EMPTY_CLIENT_RECT,
      popoverRect = Constants.EMPTY_CLIENT_RECT,
    } = params;
    const { windowBorderPadding: padding, align } = this.props;
    const { popoverInfo: currentPopoverInfo } = this.state;
    const popoverInfo = {
      position,
      nudgedLeft,
      nudgedTop,
      targetRect,
      popoverRect,
      align,
    };

    if (!popoverInfosAreEqual(currentPopoverInfo, popoverInfo)) {
      this.setState({ popoverInfo }, () => {
        if (this.willUnmount) {
          return;
        }

        targetRect = this.target.getBoundingClientRect();
        popoverRect = this.popoverDiv.getBoundingClientRect();

        const { top, left } = this.getLocationForPosition(position, targetRect, popoverRect);

        callback(
          (position === 'top' && top < padding) ||
          (position === 'left' && left < padding) ||
          (position === 'right' && left + popoverRect.width > window.innerWidth - padding) ||
          (position === 'bottom' && top + popoverRect.height > window.innerHeight - padding),
          {
            width: popoverRect.width,
            height: popoverRect.height,
            top,
            left,
          },
        );
      });
    }
  }


  render() {
    const { isOpen, content, contentDestination, children, transitionDuration } = this.props;
    const { popoverInfo } = this.state;

    let popoverContent = null;
    if (this.popoverDiv && popoverInfo) {
      popoverContent = (
        <PopoverPortal
          isOpen={isOpen}
          delay={transitionDuration}
          element={this.popoverDiv}
          container={contentDestination}
        >
          {portalProps => (typeof content === 'function'
            ? content({ ...popoverInfo, ...portalProps })
            : content)
          }
        </PopoverPortal>
      );
    }

    return (
      <>
        {children}
        {popoverContent}
      </>
    );
  }
}
