import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions, selectors } from 'store';

import { GdprDialog } from './GdprDialog';

class GdprDialogContainer extends React.Component {
  static propTypes = {
    isGdprConsented: PropTypes.bool,
    consentGdpr: PropTypes.func,
  }

  static defaultProps = {
    isGdprConsented: false,
  }

  state = {
    isConsenting: false,
  }

  handleGdprDialogSubmit = async () => {
    const { consentGdpr } = this.props;

    this.setState({ isConsenting: true });
    await consentGdpr();
    this.setState({ isConsenting: false });
  }

  render() {
    const { isGdprConsented } = this.props;
    const { isConsenting } = this.state;

    return (
      <GdprDialog
        isLoading={isConsenting}
        isOpen={isGdprConsented === false}
        onSubmit={this.handleGdprDialogSubmit}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { isGdprConsented } = selectors.auth;

  return {
    isGdprConsented: isGdprConsented(auth),
  };
};

const ConnectedGdprDialogContainer = connect(mapStateToProps, { ...actions.auth })(GdprDialogContainer);

export { ConnectedGdprDialogContainer as GdprDialogContainer };
