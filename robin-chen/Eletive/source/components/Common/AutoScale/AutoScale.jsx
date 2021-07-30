import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AutoScaleWrapper = styled.div``;

const AutoScaleContainer = styled.div`
  width: ${props => props.scaleDesktop * props.contentWidth}px;
  height: ${props => props.scaleDesktop * props.contentHeight}px;
  overflow: hidden;

  @media screen and (max-width: ${props => props.breakpoint}px) {
    width: ${props => props.scaleMobile * props.contentWidth}px;
    height: ${props => props.scaleMobile * props.contentHeight}px;
  }
`;

const AutoScaleContent = styled.div`
  transform: scale(${props => props.scaleDesktop});
  transform-origin: 0 0 0;

  @media screen and (max-width: ${props => props.breakpoint}px) {
    transform: scale(${props => props.scaleMobile})
  }
`;

export class AutoScale extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    breakpoint: PropTypes.number,
    scaleDesktop: PropTypes.number,
    scaleMobile: PropTypes.number,
  };

  static defaultProps = {
    breakpoint: 768,
    scaleDesktop: 1.0,
    scaleMobile: 1.0,
  };

  constructor(props) {
    super(props);

    this.state = {
      contentSize: { width: 0, height: 0 },
    };

    this.wrapperRef = React.createRef();
    this.containerRef = React.createRef();
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const content = this.contentRef.current;
    const actualContent = content.children[0];

    this.setState(({ contentSize }) => {
      if (contentSize.width !== actualContent.offsetWidth || contentSize.height !== actualContent.offsetHeight) {
        return { contentSize: { width: actualContent.offsetWidth, height: actualContent.offsetHeight } };
      }
      return null;
    });
  }

  render() {
    const { contentSize } = this.state;
    const { children, breakpoint, scaleDesktop, scaleMobile } = this.props;

    return (
      <AutoScaleWrapper ref={this.wrapperRef}>
        <AutoScaleContainer
          ref={this.containerRef}
          breakpoint={breakpoint}
          contentWidth={contentSize.width}
          contentHeight={contentSize.height}
          scaleDesktop={scaleDesktop}
          scaleMobile={scaleMobile}
        >
          <AutoScaleContent
            ref={this.contentRef}
            breakpoint={breakpoint}
            scaleDesktop={scaleDesktop}
            scaleMobile={scaleMobile}
          >
            {React.Children.only(children)}
          </AutoScaleContent>
        </AutoScaleContainer>
      </AutoScaleWrapper>
    );
  }
}
