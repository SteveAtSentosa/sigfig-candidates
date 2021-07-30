import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import _ from 'lodash';

import { store } from 'store';

import { ScreenSizes } from 'utilities/common';
import { withTranslation } from 'utilities/decorators';

import {
  filledEllipse,
  applyIcon,
  filterIcon,
} from 'images/icons/common';
import { Comments } from 'Constants';
import {
  InlineButton,
  RadioButtonList,
  Accordion,
  SvgImage,
  DateRangeSelect,
  FormButton,
  TargetPopover,
} from 'Components/Common';
import * as OwnComponents from './CommentFilter.Components';

@withTranslation('CommentFilter')
class CommentFilter extends React.PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      dateRange: PropTypes.arrayOf(PropTypes.object),
      acknowledge: PropTypes.bool,
      reply: PropTypes.number,
      read: PropTypes.number,
      label: PropTypes.number,
    }),
    screenSize: PropTypes.number,
    onApply: PropTypes.func,
  };

  static defaultProps = {
    config: {
      dateRange: [],
      acknowledge: Comments.AcknowledgeFilterType.All,
      reply: Comments.ReplyFilterType.All,
      read: Comments.ReadFilterType.All,
      label: Comments.LabelsFilterType.All,
    },
  };

  constructor(props) {
    super(props);

    const { config } = this.props;
    this.state = {
      ...config,
    };

    this.handleFilterItem = this.handleFilterItem.bind(this);
    this.renderFilterItem = this.renderFilterItem.bind(this);
  }

  handleApply = () => {
    const { onApply } = this.props;
    const { acknowledge, dateRange, reply, read, label } = this.state;

    onApply && onApply({
      acknowledge,
      dateRange,
      reply,
      read,
      label,
    });
  }

  handleFilterItem = (key, value) => {
    const filterValue = this.convertFilterValueToType(key, value);
    this.setState({
      [key]: filterValue,
    });
  }

  convertFilterValueToType(filterType, filterKey) {
    let newValue;
    switch (filterType) {
      case 'acknowledge':
        newValue = Comments.AcknowledgeFilterType[filterKey];
        break;
      case 'label':
        newValue = Comments.LabelsFilterType[filterKey];
        break;
      case 'read':
        newValue = Comments.ReadFilterType[filterKey];
        break;
      case 'reply':
        newValue = Comments.ReplyFilterType[filterKey];
        break;
      default:
        newValue = filterKey;
        break;
    }
    return newValue;
  }

  renderDateRange() {
    const { dateRange } = this.state;

    return (
      <OwnComponents.CommentDateRangeWrapper>
        <DateRangeSelect value={dateRange} onChange={value => this.handleFilterItem('dateRange', value)} />
      </OwnComponents.CommentDateRangeWrapper>
    );
  }

  renderAcknowledgeRadioButtonList() {
    const { i18n } = this.props;
    const { acknowledge } = this.state;
    const items = Object.keys(Comments.AcknowledgeFilterType).map(key => ({
      key,
      title: i18n(`Acknowledge.Values.${key}`),
    }));

    return (
      <RadioButtonList
        isHorizontal
        items={items}
        selectedValue={_.invert(Comments.AcknowledgeFilterType)[acknowledge]}
        onChange={value => this.handleFilterItem('acknowledge', value)}
      />
    );
  }

  renderLabelsRadioButtonList() {
    const { i18n } = this.props;
    const { label } = this.state;
    const items = Object.keys(Comments.LabelsFilterType).map((key) => {
      const color = Comments.LabelColors[key];

      return {
        key,
        title: i18n(`Labels.Values.${key}`),
        icon: color && (<SvgImage source={filledEllipse} style={{ color }} />),
      };
    });

    return (
      <RadioButtonList
        items={items}
        selectedValue={_.invert(Comments.LabelsFilterType)[label]}
        onChange={value => this.handleFilterItem('label', value)}
      />
    );
  }

  renderReadRadioButtonList() {
    const { i18n } = this.props;
    const { read } = this.state;
    const items = Object.keys(Comments.ReadFilterType).map(key => ({
      key,
      title: i18n(`Read.Values.${key}`),
    }));

    return (
      <RadioButtonList
        items={items}
        selectedValue={_.invert(Comments.ReadFilterType)[read]}
        onChange={value => this.handleFilterItem('read', value)}
      />
    );
  }

  renderReplyRadioButtonList() {
    const { i18n } = this.props;
    const { reply } = this.state;
    const items = Object.keys(Comments.ReplyFilterType).map(key => ({
      key,
      title: i18n(`Reply.Values.${key}`),
    }));

    return (
      <RadioButtonList
        items={items}
        selectedValue={_.invert(Comments.ReplyFilterType)[reply]}
        onChange={value => this.handleFilterItem('reply', value)}
      />
    );
  }

  renderDesktopFilter = ({ closePopup }) => {
    const { i18n } = this.props;

    return (
      <Provider store={store}>
        <OwnComponents.CommentFilterContainer>
          <OwnComponents.CommentFilterContent>
            <OwnComponents.CommentDesktopFilterItem>
              <OwnComponents.CommentDesktopFilterTitle>
                {i18n('DateRange.Title')}
              </OwnComponents.CommentDesktopFilterTitle>
              { this.renderDateRange() }
              <OwnComponents.CommentDesktopFilterTitle>
                { i18n('Acknowledge.Title') }
              </OwnComponents.CommentDesktopFilterTitle>
              { this.renderFilterItem('Acknowledge') }
            </OwnComponents.CommentDesktopFilterItem>
            <OwnComponents.CommentDesktopFilterItem>
              <OwnComponents.CommentDesktopFilterTitle>
                { i18n('Reply.Title') }
              </OwnComponents.CommentDesktopFilterTitle>
              { this.renderFilterItem('Reply') }
            </OwnComponents.CommentDesktopFilterItem>
            <OwnComponents.CommentDesktopFilterItem>
              <OwnComponents.CommentDesktopFilterTitle>
                { i18n('Read.Title') }
              </OwnComponents.CommentDesktopFilterTitle>
              { this.renderFilterItem('Read') }
            </OwnComponents.CommentDesktopFilterItem>
            <OwnComponents.CommentDesktopFilterItem>
              <OwnComponents.CommentDesktopFilterTitle>
                { i18n('Labels.Title') }
              </OwnComponents.CommentDesktopFilterTitle>
              { this.renderFilterItem('Labels') }
            </OwnComponents.CommentDesktopFilterItem>
          </OwnComponents.CommentFilterContent>
          <OwnComponents.CommentFilterFooter>
            <InlineButton
              text={i18n('Buttons.Apply')}
              icon={applyIcon}
              onClick={() => {
                this.handleApply();
                closePopup();
              }}
            />
          </OwnComponents.CommentFilterFooter>
        </OwnComponents.CommentFilterContainer>
      </Provider>
    );
  }

  renderFilterItem(key) {
    switch (key) {
      case 'DateRange':
        return this.renderDateRange();
      case 'Reply':
        return this.renderReplyRadioButtonList();
      case 'Read':
        return this.renderReadRadioButtonList();
      case 'Acknowledge':
        return this.renderAcknowledgeRadioButtonList();
      case 'Labels':
        return this.renderLabelsRadioButtonList();
      default:
        return '';
    }
  }

  renderMobileFilter = ({ closePopup }) => {
    const { i18n } = this.props;
    const accordionProps = {
      items: [
        {
          key: 'DateRange',
          value: i18n('DateRange.Title'),
        },
        {
          key: 'Reply',
          value: i18n('Reply.Title'),
        },
        {
          key: 'Read',
          value: i18n('Read.Title'),
        },
        {
          key: 'Acknowledge',
          value: i18n('Acknowledge.Title'),
        },
        {
          key: 'Labels',
          value: i18n('Labels.Title'),
        },
      ],
      itemRenderer: this.renderFilterItem,
    };

    return (
      <Provider store={store}>
        <OwnComponents.CommentFilterContainer>
          <OwnComponents.CommentFilterContent>
            <Accordion {...accordionProps} />
          </OwnComponents.CommentFilterContent>
          <OwnComponents.CommentFilterFooter>
            <InlineButton
              text={i18n('Buttons.Apply')}
              icon={applyIcon}
              onClick={() => {
                this.handleApply();
                closePopup();
              }}
            />
          </OwnComponents.CommentFilterFooter>
        </OwnComponents.CommentFilterContainer>
      </Provider>
    );
  }

  render() {
    const { i18n, screenSize } = this.props;
    const isMobile = screenSize < ScreenSizes.md;

    return (
      <TargetPopover
        minWidthByTarget
        contentRenderer={(isMobile ? this.renderMobileFilter : this.renderDesktopFilter)}
      >
        <FormButton icon={filterIcon} text={i18n('TargetTitle')} />
      </TargetPopover>
    );
  }
}

function mapStateToProps({ app }) {
  const { screenSize } = app;

  return {
    screenSize,
  };
}

const ConnectedCommentFilter = connect(mapStateToProps, null, null, { forwardRef: true })(CommentFilter);

export { ConnectedCommentFilter as CommentFilter };
