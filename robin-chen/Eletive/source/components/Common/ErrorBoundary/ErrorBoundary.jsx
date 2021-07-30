import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { Icon, Intent, Classes } from '@blueprintjs/core';

import { store, actions } from 'store';
import { withTranslation } from 'utilities/decorators';

const Container = styled.div`
  text-align: center;
  margin-top: 42px;
`;

@withTranslation('ErrorBoundary')
class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    hasError: false,
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });

    store.dispatch(actions.app.sendError(JSON.stringify([
      error.stack,
      info,
      window.navigator.userAgent,
    ])));

    const { history } = this.props;

    const unlisten = history.listen(() => {
      this.setState({ hasError: false });
      unlisten();
    });
  }

  render() {
    const { hasError } = this.state;
    const { children, i18n } = this.props;

    if (hasError) {
      return (
        <Container>
          <div>
            <Icon icon="warning-sign" iconSize={64} intent={Intent.DANGER} />

            <h1 className={Classes.TEXT_MUTED}>{i18n('Title')}</h1>
            <h3 className={Classes.TEXT_MUTED}>{i18n('ContactText')}</h3>
            <small className={Classes.TEXT_MUTED}>{Date()}</small>
          </div>
        </Container>
      );
    }

    return children;
  }
}

const ErrorBoundaryWithRouter = withRouter(ErrorBoundary);

export { ErrorBoundaryWithRouter as ErrorBoundary };
