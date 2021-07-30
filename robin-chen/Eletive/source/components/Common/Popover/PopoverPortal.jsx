import * as React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import * as Models from 'Models/index';

export class PopoverPortal extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    delay: PropTypes.number,
    container: PropTypes.instanceOf(window.Element),
    element: PropTypes.instanceOf(window.Element).isRequired,
    children: Models.Common.RenderableElement.isRequired,
  }

  static defaultProps = {
    isOpen: false,
    delay: 300,
    container: window.document.body,
  }

  state = {
    isOpen: false,
    willChangeTo: null,
  }

  componentDidMount() {
    const { container, element, isOpen } = this.props;
    container.appendChild(element);

    if (isOpen) {
      this.open();
    }
  }

  componentDidUpdate(prevProps) {
    const { container: prevContainer } = prevProps;
    const { container, element, isOpen } = this.props;

    // NOTE: When container can be changed? What for?
    if (prevContainer !== container) {
      prevContainer.removeChild(element);
      container.appendChild(element);
    }

    if (isOpen && !prevProps.isOpen) {
      this.open();
    } else if (!isOpen && prevProps.isOpen) {
      this.close();
    }
  }

  componentWillUnmount() {
    const { container, element } = this.props;
    container.removeChild(element);
    this.cancelQueue();
  }

  open() {
    this.cancelQueue();

    const { element, delay } = this.props;
    // Force a reflow, so that a transition will be rendered
    // between the initial state, and the state that results
    // from setting `willChangeTo = "open"`.
    element && element.scrollTop;

    this.setState({
      willChangeTo: 'open',
    });

    this.didChangeTimeout = setTimeout(() => {
      this.setState({
        isOpen: true,
        willChangeTo: null,
      });
      delete this.didChangeTimeout;
    }, delay);
  }

  close() {
    const { delay } = this.props;
    this.cancelQueue();

    this.setState({
      willChangeTo: 'closed',
    });

    this.didChangeTimeout = setTimeout(() => {
      this.setState({
        isOpen: false,
        willChangeTo: null,
      });
      delete this.didChangeTimeout;
    }, delay);
  }

  cancelQueue() {
    if (this.didChangeTimeout) {
      clearTimeout(this.didChangeTimeout);
      delete this.didChangeTimeout;
    }
  }

  renderChildren = () => {
    const { children } = this.props;
    const { isOpen, willChangeTo } = this.state;

    if (typeof children === 'function') {
      return children({
        isOpen,
        willOpen: willChangeTo === 'open',
        willClose: willChangeTo === 'closed',
      });
    }
    return children;
  }

  render() {
    const { element, isOpen } = this.props;
    const { isOpen: isOpenState, willChangeTo } = this.state;

    if (!isOpen && !isOpenState && !willChangeTo) {
      return null;
    }

    return createPortal(this.renderChildren(), element);
  }
}
