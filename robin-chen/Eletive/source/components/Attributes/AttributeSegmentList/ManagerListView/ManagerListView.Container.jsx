import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getManagerListBySegment } from 'services/users';
import { createSegmentInExtendedFormat } from 'services/attributes';

import { actions } from 'store';
import * as Models from 'Models';
import { Loader } from 'Components/Common';

import { ManagerListView } from './ManagerListView';

class ManagerListViewContainer extends React.Component {
  static propTypes = {
    segment: Models.Attribute.Segment,
    attribute: Models.Attribute.Attribute,
    userList: Models.User.UserList,
    isUserListFetching: PropTypes.bool,
    segmentManagerDeleteRequest: Models.Common.RequestStatus,
    fetchUserList: PropTypes.func,
    addSegmentManager: PropTypes.func,
    deleteSegmentManager: PropTypes.func,
    onSegmentManagerAdd: PropTypes.func.isRequired,
    onSegmentManagerDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isUserListFetching: false,
  }

  componentDidMount() {
    const { fetchUserList } = this.props;

    fetchUserList();
  }

  handleManagerAdd = async (user) => {
    const { segment, attribute, addSegmentManager } = this.props;

    const segmentInExtendedFormat = createSegmentInExtendedFormat(segment, attribute);
    await addSegmentManager(user, attribute, segmentInExtendedFormat);

    const { onSegmentManagerAdd } = this.props;
    onSegmentManagerAdd(user);
  }

  handleManagerDelete = async (user) => {
    const { segment, attribute, deleteSegmentManager } = this.props;

    const segmentInExtendedFormat = createSegmentInExtendedFormat(segment, attribute);
    await deleteSegmentManager(user, segmentInExtendedFormat);

    const { onSegmentManagerDelete } = this.props;
    onSegmentManagerDelete(user);
  }

  render() {
    const { attribute, segment, isUserListFetching, ...props } = this.props;

    if (isUserListFetching) {
      return <Loader />;
    }

    return (
      <ManagerListView
        {...props}
        onManagerAdd={this.handleManagerAdd}
        onManagerDelete={this.handleManagerDelete}
      />
    );
  }
}

const mapStateToProps = ({ users, attributes }, { segment }) => {
  const { userList, userListFetchStatus } = users;
  const {
    segmentManagerDeleteRequest,
  } = attributes;

  // TODO: replace with query SegmentManagers: only managers instead whole user list
  const managerList = getManagerListBySegment(userList, segment);

  return {
    userList,
    managerList,
    segmentManagerDeleteRequest,
    isUserListFetching: userListFetchStatus === 'pending',
  };
};

const ConnectedManagerListViewContainer = connect(
  mapStateToProps, {
    ...actions.attributes,
    ...actions.users,
  },
)(ManagerListViewContainer);

export { ConnectedManagerListViewContainer as ManagerListViewContainer };
