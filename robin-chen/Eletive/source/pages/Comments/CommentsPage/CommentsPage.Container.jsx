import React from 'react';
import { connect } from 'react-redux';

import { actions, selectors } from 'store';
import { buildRoute } from 'utilities/router';
import { getTargetByUrl, Targets } from 'utilities/reports';
import { Routes } from 'Constants';

import { CommentsPage } from './CommentsPage';

class CommentsPageContainer extends React.PureComponent {
  componentDidMount() {
    const { fetchCommentList } = this.props;
    fetchCommentList();
  }

  get urlSegmentID() {
    const { match: { params: { segmentID } } } = this.props;
    return segmentID;
  }

  get breadcrumbs() {
    const { baseRoute, backRoute, parameters, breadcrumbRoot } = this.getBaseRoute();

    return [
      {
        name: breadcrumbRoot,
        route: buildRoute(backRoute, parameters),
      },
      {
        name: 'PageTitle',
        route: buildRoute(baseRoute, parameters),
      },
    ];
  }

  get getTarget() {
    const { match } = this.props;

    return getTargetByUrl(match);
  }

  getBaseRoute() {
    let parameters = {};
    let baseRoute;
    let backRoute;
    let breadcrumbRoot = 'Breadcrumbs.';

    const segmentID = this.urlSegmentID;
    const target = this.getTarget;

    if (target === Targets.Segments) {
      breadcrumbRoot += 'Segments';
      baseRoute = Routes.Segments.Comments.Base;
      backRoute = Routes.Segments.Base;
      parameters = { segmentID };
    } else if (target === Targets.Organization) {
      breadcrumbRoot += 'Organization';
      baseRoute = Routes.Organization.Comments.Base;
      backRoute = Routes.Organization.Base;
    } else if (target === Targets.Individual) {
      breadcrumbRoot += 'Individual';
      baseRoute = Routes.Individual.Comments.Base;
      backRoute = Routes.Individual.Base;
    }

    return { baseRoute, backRoute, parameters, breadcrumbRoot };
  }

  get filteredComments() {
    const { comments } = this.props;
    const target = this.getTarget;

    if (target === Targets.Segments) {
      const selectedSegment = this.urlSegmentID;
      return comments.filter(({ segments }) => segments.includes(selectedSegment));
    }

    if (target === Targets.Individual) {
      return comments.filter(({ leftByMe }) => leftByMe);
    }

    return comments;
  }

  render() {
    return (
      <CommentsPage
        {...this.props}
        comments={this.filteredComments}
        breadcrumbs={this.breadcrumbs}
      />
    );
  }
}

const mapStateToProps = ({ app, auth, comments }) => {
  const { language, screenSize } = app;
  const { currentUser } = auth;
  const { commentList } = comments;
  const enhancedComments = commentList.map((comment) => {
    const { question } = comment;

    if (question) {
      const { content } = question;
      return { ...comment, title: content[language] || content.en };
    }

    return { ...comment, title: '' };
  });

  const {
    isCurrentUserOwner,
    isCurrentUserAnalyst,
    isCurrentUserAdministrator,
  } = selectors.auth;

  return {
    comments: enhancedComments,
    language,
    screenSize,
    currentUser,
    isPrivilegedUser: isCurrentUserOwner(auth) || isCurrentUserAnalyst(auth) || isCurrentUserAdministrator(auth),
  };
};

const ConnectedCommentsPageContainer = connect(mapStateToProps, {
  ...actions.comments,
  ...actions.chat,
})(CommentsPageContainer);

export { ConnectedCommentsPageContainer as CommentsPageContainer };
