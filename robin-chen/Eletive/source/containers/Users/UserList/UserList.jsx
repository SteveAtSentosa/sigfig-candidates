import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { withTranslation } from 'utilities/decorators';
import { ScreenSizes } from 'utilities/common';
import { buildRoute } from 'utilities/router';

import { Routes } from 'Constants/index';

import { actions, selectors } from 'store';
import * as UserModels from 'Models/Users';
import * as CommonModels from 'Models/Common';

import {
  Checkbox,
  IntroSplash,
  SortableTable,
  SortableTableCommons,
  ActionMenu,
  Loader,
  SingleSelect as Select,
  UserAvatar,
  SearchBox,
  HelpPopover,
  Markdown,
} from 'Components/Common';
import { deleteBinIcon, editIcon } from 'images/icons/common';
import { emptyTemplates } from 'images/one-on-ones';

import * as Own from './UserList.Components';

@withTranslation('UserList')
class UserList extends React.Component {
  static propTypes = {
    userList: UserModels.UserList,
    userListTotalCount: PropTypes.number,
    userListFetchStatus: CommonModels.RequestStatus,
    setUserListFilter: PropTypes.func,
    onUserDelete: PropTypes.func,
    onUserSelect: PropTypes.func,
  }

  state = {
    usersToDelete: [],
    filterStatus: null,
    filterText: '',
  }

  constructor(props) {
    super(props);

    this.userList = React.createRef();
    const { i18n } = this.props;
    this.filterItems = [
      {
        id: 'default',
        title: i18n('Filter.Options.Default'),
      },
      {
        id: 'email-bounce',
        title: i18n('Filter.Options.BounceEmails'),
      },
    ];
  }

  componentDidMount() {
    const { i18n, setUserListFilter } = this.props;
    this.setState({
      filterStatus: {
        id: 'default',
        title: i18n('Filter.Options.Default'),
      },
      filterText: '',
    });
    setUserListFilter({ filterText: '', filterOption: 'default' });
  }

  get columns() {
    const { i18n } = this.props;

    return [
      {
        key: 'firstName',
        title: i18n('Columns.Name'),
        style: { width: '240px' },
        sortable: (a, b, mode) => {
          if (a.firstName === b.firstName) {
            return 0;
          }
          return mode * (a.firstName > b.firstName ? 1 : -1);
        },
      },
      { key: 'bounced', title: '', style: { width: '16px', paddingLeft: 0 } },
      {
        key: 'lastSurveyFinishedDate',
        title: i18n('Columns.Last survey finished'),
        style: { width: '145px' },
        sortable: true,
      },
      {
        key: 'lastSigninDate',
        title: i18n('Columns.Last sign in'),
        style: { width: '140px' },
        sortable: true,
      },
      {
        key: 'role',
        title: i18n('Columns.Role'),
        style: { width: '100px' },
        sortable: true,
      },
      {
        key: 'action',
        title: i18n('Columns.Action'),
        style: { width: '30px', justifyContent: 'center' },
      },
    ];
  }

  get shouldRenderPreloader() {
    return this.isUserListFetching;
  }

  get shouldRenderUserList() {
    const { userList } = this.props;
    return this.isUserListFetching === false && userList.length > 0;
  }

  get isUserListFetching() {
    const { userListFetchStatus } = this.props;
    return userListFetchStatus === 'pending';
  }

  handleChangeStatusFilter = (filterStatus) => {
    const { setUserListFilter } = this.props;
    const { filterText } = this.state;
    const filterOption = filterStatus.id;

    this.setState({ filterStatus });
    setUserListFilter({ filterText, filterOption });
  }

  handleSearchChange = (filterText) => {
    const { setUserListFilter } = this.props;
    const { filterStatus } = this.state;
    const filterOption = filterStatus.id;

    this.setState({ filterText });
    setUserListFilter({ filterText, filterOption });
  }

  handleEditItem = item => () => {
    const { history } = this.props;

    history.push(buildRoute(Routes.Settings.Users.Edit, { userID: item.id }));
  }

  handleDeleteItem = item => () => {
    const { onUserDelete } = this.props;
    onUserDelete(item);
  }

  handleCheckForDelete = user => (event) => {
    event.stopPropagation();
    event.preventDefault();

    const { usersToDelete: currentUsersToDelete } = this.state;
    const usersToDelete = currentUsersToDelete.filter(({ id }) => id !== user.id);

    if (usersToDelete.length === currentUsersToDelete.length) {
      usersToDelete.push(user);
    }
    this.setState({ usersToDelete });

    const { onUserSelect } = this.props;
    onUserSelect(usersToDelete);
  }

  isUserSelected(user) {
    const { usersToDelete } = this.state;
    return !!usersToDelete.find(({ id }) => id === user.id);
  }

  renderInlineActionMenu = (item) => {
    const { i18n } = this.props;
    const actionItems = [
      {
        title: i18n('DeleteButton.Text'),
        icon: deleteBinIcon,
        onClick: this.handleDeleteItem(item),
      },
      {
        title: i18n('EditButton.Text'),
        icon: editIcon,
        onClick: this.handleEditItem(item),
      },
    ];
    return (
      <ActionMenu popoverProps={{ position: 'bottom', align: 'end' }} items={actionItems} />
    );
  }

  renderRow = (item, columns) => {
    const { i18n } = this.props;
    const isChecked = this.isUserSelected(item);
    return (
      <>
        <SortableTableCommons.RowCell style={columns[0].style}>
          <Own.RowUserAvatarContainer isChecked={isChecked}>
            <Own.CheckboxWrapper>
              <Checkbox isChecked={isChecked} onClick={this.handleCheckForDelete(item)} />
            </Own.CheckboxWrapper>
            {
              !isChecked && <UserAvatar normal user={item} />
            }
          </Own.RowUserAvatarContainer>
          <Own.NameContainer>
            {item.name}
            <Own.Email>{item.email}</Own.Email>
          </Own.NameContainer>
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[1].style}>
          {
            item.bounced &&
            <HelpPopover content={<Markdown source={i18n.global('CreateEditUserForm.Fields.Email.BouncedText')} />}>
              <Own.BouncedInformation />
            </HelpPopover>
          }
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[2].style}>
          {!item.lastSurvey ?
            i18n('EmptyDate') : moment.unix(item.lastSurvey).format('MMM DD, YYYY')}
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[3].style}>
          {!item.lastLogin ?
            i18n('EmptyDate') : moment.unix(item.lastLogin).format('MMM DD, YYYY')}
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[4].style}>
          {item.role}
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[5].style}>
          {this.renderInlineActionMenu(item)}
        </SortableTableCommons.RowCell>
      </>);
  }

  renderMobileRow = (item, columns) => (
    <SortableTableCommons.MobileContainer>
      <SortableTableCommons.MobileHeader>
        <Own.MobileUser>
          <UserAvatar normal user={item} />
          <Own.NameContainer>
            {item.name}
            <Own.Email>{item.email}</Own.Email>
          </Own.NameContainer>
        </Own.MobileUser>
        {this.renderInlineActionMenu(item)}
      </SortableTableCommons.MobileHeader>
      <SortableTableCommons.MobileRow>
        <SortableTableCommons.MobileCell
          value={moment.unix(item.lastSurvey).format('MMM DD, YYYY')}
          title={columns[1].title}
        />
        <SortableTableCommons.MobileCell
          value={`${item.role}`}
          title={columns[3].title}
        />
      </SortableTableCommons.MobileRow>
      <SortableTableCommons.MobileRow>
        <SortableTableCommons.MobileCell
          value={moment.unix(item.lastLogin).format('MMM DD, YYYY')}
          title={columns[2].title}
        />
      </SortableTableCommons.MobileRow>
    </SortableTableCommons.MobileContainer>
  );

  render() {
    const { filterStatus } = this.state;
    const { i18n, userList, userListTotalCount } = this.props;

    if (this.shouldRenderPreloader) {
      return <Loader />;
    }

    return (
      <>
        <Own.HeaderContainer>
          <Own.HeaderTitle>
            {i18n('UserCount', {
              totalUserCount: userListTotalCount,
            })}
          </Own.HeaderTitle>
          <Own.FilterWrapper>
            <Own.FilterText>
              {i18n('Filter.Label')}
            </Own.FilterText>
            <Select
              items={this.filterItems}
              activeItem={filterStatus || this.filterItems[0]}
              itemRenderer={item => item.title}
              onItemSelect={this.handleChangeStatusFilter}
            />
          </Own.FilterWrapper>
          <Own.SearchInputWrapper>
            <SearchBox onChange={this.handleSearchChange} />
          </Own.SearchInputWrapper>
        </Own.HeaderContainer>
        {!this.shouldRenderUserList ?
          <IntroSplash title={i18n('IntroMessages.AddNewUser')} icon={emptyTemplates} /> :
          <Own.UserTableContainer>
            <SortableTable
              hideHeaderOnMobile
              keyField="id"
              mobileThreshold={ScreenSizes.md}
              columns={this.columns}
              items={userList}
              rowRenderer={this.renderRow}
              mobileRowRenderer={this.renderMobileRow}
              onClickItem={item => this.handleEditItem(item)()}
            />
          </Own.UserTableContainer>
        }
      </>
    );
  }
}

function mapStateToProps({ app, auth, users }) {
  const { language } = app;

  const {
    userListPageNumber,
    userListFilterText,
    userListFilterOption,
    userListFetchStatus,
  } = users;

  const { filteredUserList } = selectors.users;

  const userList = filteredUserList({ auth, users });

  const pagedUserList = userList.slice(0, userListPageNumber * 50);

  return {
    language,
    userList: pagedUserList,
    userListTotalCount: userList.length,
    userListFetchStatus,
    filterText: userListFilterText,
    filterOption: userListFilterOption,
  };
}

export default connect(mapStateToProps, { ...actions.users })(UserList);
