import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getUserListBySegment } from 'services/users';

import { actions } from 'store';
import * as UserModels from 'Models/Users';

import { Line, Loader } from 'Components/Common';
import { UserInformationWidget } from 'Components/Users';
import * as Own from './EmployeeListView.Components';

class EmployeeListView extends React.PureComponent {
  static propTypes = {
    isUserListFetching: PropTypes.bool,
    userList: UserModels.UserList,
    fetchUserList: PropTypes.func,
  }

  componentDidMount() {
    const { fetchUserList } = this.props;

    fetchUserList();
  }

  render() {
    const { userList, isUserListFetching } = this.props;

    if (isUserListFetching) {
      return <Loader />;
    }

    return (
      <Own.Container>
        {
          userList.map((employee, index) => (
            <React.Fragment key={employee.id}>
              <UserInformationWidget user={employee} />
              {
                index !== userList.length - 1 &&
                <Line marginTop={20} marginBottom={20} />
              }
            </React.Fragment>
          ))
        }
      </Own.Container>

    );
  }
}

const mapStateToProps = ({ users }, { segment, attribute }) => {
  const { userList, userListFetchStatus } = users;

  // TODO: replace by query with segment param: only users that need for list
  return {
    userList: getUserListBySegment(userList, attribute, segment),
    isUserListFetching: userListFetchStatus === 'pending',
  };
};

const ConnectedEmployeeListView = connect(
  mapStateToProps, {
    ...actions.attributes,
    ...actions.users,
  },
)(EmployeeListView);

export { ConnectedEmployeeListView as EmployeeListView };
