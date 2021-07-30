import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import moment from 'moment';

import { ScreenSizes } from 'utilities/common';
import { buildRoute } from 'utilities/router';
import { withTranslation } from 'utilities/decorators';
import { getTargetByUrl, Targets } from 'utilities/reports';
import { SectionHeader } from 'Components';
import { CommentFilter, CommentList } from 'Components/Comments';
import { SearchBox, Label, PageContainer, PageContent } from 'Components/Common';
import * as Models from 'Models';
import { Select } from 'Components/Common/DropDown/Select';
import Constants from 'Constants/Comments';
import Routes from 'Constants/Routes';
import { SegmentSelector } from 'Components/Attributes';
import { sortList } from 'utilities/lists';

import * as OwnComponents from './CommentsPage.Components';

@withTranslation('Comments')
class CommentsPage extends React.PureComponent {
  static propTypes = {
    isPrivilegedUser: PropTypes.bool,
    screenSize: PropTypes.number,
    comments: Models.Comments.Comments,
    currentUser: Models.User.CurrentUser,
    breadcrumbs: Models.Common.BreadcrumbList.isRequired,
    updateComment: PropTypes.func.isRequired,
    createChatMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    comments: [],
  };

  state = {
    sortBy: Constants.SortByOptions.Unread,
    filters: {
      dateRange: [],
      acknowledge: Constants.AcknowledgeFilterType.All,
      reply: Constants.ReplyFilterType.All,
      read: Constants.ReadFilterType.All,
      label: Constants.LabelsFilterType.All,
    },
    searchKey: '',
  };

  get isMobile() {
    const { screenSize } = this.props;
    return screenSize < ScreenSizes.lg;
  }

  get headerBreadcrumbs() {
    const { breadcrumbs, i18n } = this.props;

    return breadcrumbs.map(({ name, route }) => ({ name: i18n(name), route }));
  }

  get filteredComments() {
    const { comments } = this.props;
    return comments.filter(comment => this.filterComment(comment));
  }

  get filteredAndSortedComments() {
    const { sortBy } = this.state;
    const comments = this.filteredComments;

    if (sortBy === Constants.SortByOptions.Unread) {
      const sortedComments = sortList(comments, { sortingField: 'createdAt', direction: 'desc' });
      const [unreadComments, readComments] = this.groupCommentsByReadState(sortedComments);
      return [...unreadComments, ...readComments];
    }

    if (sortBy === Constants.SortByOptions.Oldest) {
      return sortList(comments, { sortingField: 'createdAt' });
    }

    return sortList(comments, { sortingField: 'createdAt', direction: 'desc' });
  }

  get urlSegmentID() {
    const { match: { params: { segmentID } } } = this.props;
    return segmentID;
  }

  filterSegmentList = (segmentList) => {
    const { currentUser, isPrivilegedUser } = this.props;
    const { manageSegments } = currentUser;

    if (isPrivilegedUser) {
      return segmentList;
    }

    return segmentList
      .filter(({ id }) => manageSegments.some(({ segment }) => segment === id));
  }

  handleChangeSortBy = ({ id }) => {
    this.setState({ sortBy: id });
  }

  handleApplyFilter = (filters) => {
    this.setState({ filters });
  }

  handleSearchChange = (searchKey) => {
    this.setState({ searchKey });
  }

  handleUpdateComment = (comment, isAcknowledged) => {
    const { updateComment } = this.props;

    updateComment(comment);

    if (isAcknowledged) {
      const { createChatMessage, i18n } = this.props;
      const { id } = comment;

      createChatMessage(id, { messageText: i18n('AcknowledgedMessage') });
    }
  }

  handleSegmentSelect = (segments) => {
    const { history } = this.props;
    history.push(buildRoute(Routes.Segments.Comments.Base, { segmentID: segments[0].id }));
  }

  groupCommentsByReadState(comments) {
    const unreadComments = comments.filter(({ chatStatistic }) => chatStatistic.unreadMessagesCount);
    const readComments = comments.filter(({ chatStatistic }) => chatStatistic.unreadMessagesCount === 0);
    return [unreadComments, readComments];
  }

  filterComment(comment) {
    const { match } = this.props;
    const { filters, searchKey } = this.state;
    const { acknowledge, dateRange: [filterStart, filterEnd], label, read, reply } = filters;
    const { chatStatistic } = comment;
    const target = getTargetByUrl(match);

    if (!comment.commentText.toLowerCase().includes(searchKey.toLowerCase())) {
      return false;
    }

    if (acknowledge !== Constants.AcknowledgeFilterType.All && comment.acknowledge !== acknowledge) {
      return false;
    }

    if (filterStart) {
      if (filterStart.isAfter(moment.unix(comment.createdAt), 'day') ||
        (filterEnd && filterEnd.isBefore(moment.unix(comment.createdAt), 'day'))) {
        return false;
      }
    }

    if (reply !== Constants.ReplyFilterType.All) {
      if (reply === Constants.ReplyFilterType.Replied && !chatStatistic.replied) {
        return false;
      }
      if (reply === Constants.ReplyFilterType.RepliedByMe && !chatStatistic.repliedByMe) {
        return false;
      }
      if (reply === Constants.ReplyFilterType.Unreplied && chatStatistic.replied) {
        return false;
      }
    }

    if (read !== Constants.ReadFilterType.All) {
      if (read === Constants.ReadFilterType.Read && chatStatistic.unreadMessagesCount > 0) {
        return false;
      }
      if (read === Constants.ReadFilterType.Unread && chatStatistic.unreadMessagesCount === 0) {
        return false;
      }
    }

    if (label !== Constants.LabelsFilterType.All) {
      if (target === Targets.Organization) {
        if (comment.organizationLabel !== label) {
          return false;
        }
      } else if (target === Targets.Segments) {
        if (comment.segmentsLabel !== label) {
          return false;
        }
      } else if (comment.individualLabel !== label) {
        return false;
      }
    }

    return true;
  }

  renderNoComment = () => {
    const { i18n } = this.props;

    return (
      <OwnComponents.NoCommentWrapper>
        <OwnComponents.NoCommentIcon />
        <OwnComponents.NoCommentText>
          {i18n('NoComment')}
        </OwnComponents.NoCommentText>
      </OwnComponents.NoCommentWrapper>
    );
  }

  renderSortBy = () => {
    const { i18n } = this.props;
    const { sortBy } = this.state;

    const sortByItems = [
      { id: Constants.SortByOptions.Unread, title: i18n('SortBy.Options.Unread') },
      { id: Constants.SortByOptions.Newest, title: i18n('SortBy.Options.Newest') },
      { id: Constants.SortByOptions.Oldest, title: i18n('SortBy.Options.Oldest') },
    ];

    const selectedItem = sortByItems.find(item => item.id === sortBy);

    return (
      <OwnComponents.SortByContainer>
        <Label inline label={i18n('SortBy.Label')} />
        <Select
          items={sortByItems}
          activeItem={selectedItem}
          onItemSelect={this.handleChangeSortBy}
        />
      </OwnComponents.SortByContainer>
    );
  }

  renderDesktopFilter = () => {
    const { i18n } = this.props;
    const { filters } = this.state;
    const numberOfComments = this.filteredComments.length;

    return (
      <OwnComponents.DesktopOnly>
        <OwnComponents.FilterBar>
          <OwnComponents.MatchingCommentText>
            {i18n('MatchingComment', { commentCount: numberOfComments })}
          </OwnComponents.MatchingCommentText>
          <OwnComponents.FilterContainer>
            {this.renderSortBy()}
            <CommentFilter config={filters} onApply={this.handleApplyFilter} />
            {this.renderSearchBox()}
          </OwnComponents.FilterContainer>
        </OwnComponents.FilterBar>
      </OwnComponents.DesktopOnly>
    );
  }

  renderMobileFilter = () => {
    const { i18n } = this.props;
    const { filters } = this.state;
    const numberOfComments = this.filteredComments.length;

    return (
      <OwnComponents.MobileOnly>
        <OwnComponents.FilterBar>
          <OwnComponents.MatchingCommentText>
            {i18n('MatchingComment', { commentCount: numberOfComments })}
          </OwnComponents.MatchingCommentText>
          <OwnComponents.FilterContainer>
            <CommentFilter config={filters} onApply={this.handleApplyFilter} />
            {this.renderSearchBox()}
          </OwnComponents.FilterContainer>
        </OwnComponents.FilterBar>
        {this.renderSortBy()}
      </OwnComponents.MobileOnly>
    );
  }

  renderComments = () => {
    const { match } = this.props;
    return (
      <PageContent>
        {this.renderDesktopFilter()}
        {this.renderMobileFilter()}
        <CommentList
          target={getTargetByUrl(match)}
          comments={this.filteredAndSortedComments}
          onUpdateComment={this.handleUpdateComment}
        />
      </PageContent>
    );
  }

  renderSearchBox = () => {
    const { i18n } = this.props;
    const { searchKey } = this.state;

    return (
      <OwnComponents.SearchBoxContainer>
        <SearchBox placeholder={i18n('Search')} value={searchKey} onChange={this.handleSearchChange} />
      </OwnComponents.SearchBoxContainer>
    );
  }

  renderHeaderActions = () => {
    const { match } = this.props;
    const target = getTargetByUrl(match);
    if (target !== Targets.Segments) {
      return null;
    }

    return this.urlSegmentID && (
      <SegmentSelector
        singleSelectionMode
        selectFirstSegmentByDefault
        fillContainer={this.isMobile}
        popoverAlign={this.isMobile ? 'center' : 'end'}
        filterSegmentList={this.filterSegmentList}
        selectedSegmentIds={[this.urlSegmentID]}
        onChange={this.handleSegmentSelect}
      />
    );
  }

  render() {
    const { i18n, comments } = this.props;
    const headerActions = this.renderHeaderActions();

    return (
      <PageContainer>
        <SectionHeader
          title={i18n('PageTitle')}
          breadcrumbItems={this.headerBreadcrumbs}
          actions={this.isMobile ? null : headerActions}
          secondaryActions={this.isMobile ? headerActions : null}
        />
        {comments.length === 0 ? this.renderNoComment() : this.renderComments()}
      </PageContainer>
    );
  }
}

const WithRouterCommentsPage = withRouter(CommentsPage);
export { WithRouterCommentsPage as CommentsPage };
