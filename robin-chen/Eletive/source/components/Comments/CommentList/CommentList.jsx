import React from 'react';
import PropTypes from 'prop-types';

import { Comments } from 'Models';
import { Targets } from 'utilities/reports';

import * as OwnComponents from './CommentList.Component';
import { CommentCard } from '../CommentCard/CommentCard';

class CommentList extends React.PureComponent {
  static propTypes = {
    target: PropTypes.number.isRequired,
    comments: Comments.Comments,
    onUpdateComment: PropTypes.func,
  };

  static defaultProps = {
    comments: [],
  };

  get commentList() {
    const { comments, target } = this.props;

    return comments.map(comment => (
      <OwnComponents.ItemContainer key={comment.id}>
        <CommentCard
          target={target}
          comment={comment}
          onUpdateAcknowledge={this.handleUpdateAcknowledge(comment)}
          onEditLabel={this.handleEditLabel(comment)}
        />
      </OwnComponents.ItemContainer>
    ));
  }

  handleUpdateAcknowledge = comment => (acknowledge) => {
    const { onUpdateComment } = this.props;
    const updatedComment = { ...comment, acknowledge };

    onUpdateComment && onUpdateComment(updatedComment, true);
  }

  handleEditLabel = comment => (label) => {
    const { target, onUpdateComment } = this.props;
    const updatedComment = {
      ...comment,
      individualLabel: undefined,
      segmentsLabel: undefined,
      organizationLabel: undefined,
    };
    if (target === Targets.Individual) {
      updatedComment.individualLabel = label;
    }
    if (target === Targets.Segments) {
      updatedComment.segmentsLabel = label;
    }
    if (target === Targets.Organization) {
      updatedComment.organizationLabel = label;
    }

    onUpdateComment && onUpdateComment(updatedComment, false);
  }

  render() {
    return (
      <OwnComponents.Container>{this.commentList}</OwnComponents.Container>
    );
  }
}

export { CommentList };
