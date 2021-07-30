import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withTranslation } from 'utilities/decorators';
import DatetimeConstants from 'Constants/Datetime';
import { HelpPopover, Markdown } from 'Components/Common';
import { User } from 'Models';
import {
  comment,
  calendar,
  avatar,
} from 'images/comments';

import OwnComponents from './CommentTitle.Components';


@withTranslation('CommentTitle')
class CommentTitle extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    managers: PropTypes.arrayOf(User.MinimalUser),
    isIndividual: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    managers: [],
  }

  get timestamp() {
    const { timestamp } = this.props;
    return moment.unix(timestamp).format(DatetimeConstants.DatetimeFormat.WithFullMonthName);
  }

  renderHelpPopoverContent = () => {
    const { managers } = this.props;

    return managers.map(({ firstName, lastName }, index) => (
      <OwnComponents.ManagerName key={index}>{firstName} {lastName}</OwnComponents.ManagerName>
    ));
  };

  render() {
    const { title, managers, i18n, isIndividual } = this.props;
    const numberOfManagers = managers.length;

    return (
      <OwnComponents.Container>
        <OwnComponents.CommentIcon source={comment} />
        <OwnComponents.DetailsContainer>
          <OwnComponents.Title>
            <Markdown source={title} />
          </OwnComponents.Title>
          <OwnComponents.InfoContainer>
            <OwnComponents.InfoIcon source={calendar} />
            {this.timestamp}
            {
              !isIndividual &&
              (numberOfManagers === 0 ?
                <OwnComponents.ManagerContainer>
                  <OwnComponents.InfoIcon source={avatar} />
                  {i18n('Managers', { managerCount: managers.length })}
                </OwnComponents.ManagerContainer>
                :
                <HelpPopover content={this.renderHelpPopoverContent()}>
                  <OwnComponents.ManagerContainer>
                    <OwnComponents.InfoIcon source={avatar} />
                    {i18n('Managers', { managerCount: managers.length })}
                  </OwnComponents.ManagerContainer>
                </HelpPopover>
              )
            }
          </OwnComponents.InfoContainer>
        </OwnComponents.DetailsContainer>
      </OwnComponents.Container>
    );
  }
}

export { CommentTitle };
