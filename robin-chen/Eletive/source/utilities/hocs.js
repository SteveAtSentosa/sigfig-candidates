import React from 'react';

export function withDelayedRendering(WrapperComponent) {
  class WithDelayedRendering extends React.PureComponent {
    state = {
      renderingDelayTimeoutExceeded: false,
    }

    componentDidMount() {
      this.renderingTimeout = setTimeout(() => {
        this.setState({
          renderingDelayTimeoutExceeded: true,
        });
      }, 0);
    }

    componentWillUnmount() {
      clearTimeout(this.renderingTimeout);
    }

    render() {
      const { renderingDelayTimeoutExceeded } = this.state;

      if (renderingDelayTimeoutExceeded === false) {
        return null;
      }
      const { forwardedRef, ...rest } = this.props;

      return (
        <WrapperComponent ref={forwardedRef} {...rest} />
      );
    }
  }
  return React.forwardRef((props, ref) => (
    <WithDelayedRendering {...props} forwardedRef={ref} />
  ));
}
