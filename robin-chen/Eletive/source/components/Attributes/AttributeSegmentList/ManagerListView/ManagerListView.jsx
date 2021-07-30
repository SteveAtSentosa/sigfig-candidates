import React from 'react';
import PropTypes from 'prop-types';

import { addIcon, deleteBinIcon } from 'images/icons/common';
import { withTranslation } from 'utilities/decorators';
import * as Models from 'Models';

import { UserInformationWidget } from 'Components/Users';
import { InlineButton, Line, Loader, SingleSelect } from 'Components/Common';
import * as Own from './ManagerListView.Components';

@withTranslation('ManagerListView')
class ManagerListView extends React.PureComponent {
  static propTypes = {
    userList: Models.User.UserList.isRequired,
    managerList: Models.User.UserList.isRequired,
    isUserListFetching: PropTypes.bool,
    segmentManagerDeleteRequest: Models.Common.RequestStatus,
    onManagerAdd: PropTypes.func.isRequired,
    onManagerDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isUserListFetching: false,
  }

  state = {
    selectedUser: null,
  }

  getRegularUsers = () => {
    const { userList, managerList } = this.props;

    const managersIDs = managerList.map(manager => manager.id);

    return userList
      .filter(user => !managersIDs.includes(user.id))
      .map(user => ({ ...user, title: `${user.name} ${user.email} ${user.id}` }));
  }

  isSegmentManagerDeleting = (manager) => {
    const { segmentManagerDeleteRequest } = this.props;

    return (
      segmentManagerDeleteRequest.status === 'pending' &&
      manager.id === segmentManagerDeleteRequest.user?.id
    );
  }

  userItemRenderer = user => (<UserInformationWidget user={user} />)

  handleUserItemSelect = (user) => {
    this.setState({ selectedUser: user });
  }

  handleAddManagerButtonClick = async () => {
    const { selectedUser } = this.state;
    const { onManagerAdd } = this.props;
    await onManagerAdd(selectedUser);

    this.setState({ selectedUser: null });
  }

  handleRemoveManagerButtonClick = manager => () => {
    const { onManagerDelete } = this.props;
    onManagerDelete(manager);
  }

  render() {
    const { i18n, managerList, isUserListFetching } = this.props;
    const { selectedUser } = this.state;

    return (
      <Own.Container>
        {
          isUserListFetching ?
            <Loader /> :
            <React.Fragment>
              <Own.SuggestContainer>
                <SingleSelect
                  filterable
                  placeholder={i18n('UserSelector.Placeholder')}
                  items={this.getRegularUsers()}
                  activeItem={selectedUser}
                  itemRenderer={this.userItemRenderer}
                  onItemSelect={this.handleUserItemSelect}
                />

                <InlineButton
                  icon={addIcon}
                  disabled={selectedUser === null}
                  onClick={this.handleAddManagerButtonClick}
                />
              </Own.SuggestContainer>

              <Own.ManagerListContainer>
                {
                  managerList.map((manager, index) => (
                    <React.Fragment key={manager.id}>
                      <Own.ManagerListItem isDeleting={this.isSegmentManagerDeleting(manager)}>
                        <UserInformationWidget user={manager} />

                        <InlineButton icon={deleteBinIcon} onClick={this.handleRemoveManagerButtonClick(manager)} />

                        {
                          this.isSegmentManagerDeleting(manager) &&
                          <Loader />
                        }
                      </Own.ManagerListItem>

                      {
                        index !== managerList.length - 1 &&
                        <Line marginTop={10} marginBottom={10} />
                      }
                    </React.Fragment>
                  ))
                }
              </Own.ManagerListContainer>
            </React.Fragment>
        }
      </Own.Container>
    );
  }
}

export { ManagerListView };
