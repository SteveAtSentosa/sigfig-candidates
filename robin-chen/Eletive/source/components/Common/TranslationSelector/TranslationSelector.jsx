import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withTranslation } from 'utilities/decorators';

import { List, InlineButton, Checkbox, TargetPopover } from 'Components/Common';
import { addIcon } from 'images/icons/common';

import { Locales } from 'Constants';
import { PopoverAlign } from 'Components/Common/Popover/Popover';

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 10px;
`;

const TitleContainer = styled.div`
  margin-right: 15px;
`;

const CheckboxWrapper = styled.div``;

@withTranslation('Common/TranslationSelector')
class TranslationSelector extends React.PureComponent {
  translationLocaleCodes = Object.keys(Locales).filter(e => e !== 'en');

  static propTypes = {
    languageList: PropTypes.arrayOf(PropTypes.string).isRequired,
    popoverProps: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  get localeList() {
    const { i18n } = this.props;
    return this.translationLocaleCodes
      .map(id => ({ id, title: i18n.global(`LanguageList.${id}`) }));
  }

  handleChangeLanguageSelect = (language, checked) => {
    const { languageList, onChange } = this.props;
    if (checked) {
      onChange([...languageList, language]);
    } else {
      onChange(languageList.filter(e => e !== language));
    }
  }

  renderItem = (item) => {
    const { languageList } = this.props;
    return (
      <ItemContainer onClick={() => this.handleChangeLanguageSelect(item.id, !languageList.includes(item.id))}>
        <TitleContainer>{item.title}</TitleContainer>
        <CheckboxWrapper onClick={e => e.stopPropagation()}>
          <Checkbox
            isChecked={languageList.includes(item.id)}
            onChange={event => this.handleChangeLanguageSelect(item.id, event.currentTarget.checked)}
            onClick={() => {}}
          />
        </CheckboxWrapper>
      </ItemContainer>
    );
  }

  render() {
    const { i18n, popoverProps } = this.props;
    const menu = () => (<List
      items={this.localeList}
      itemRenderer={this.renderItem}
    />);
    return (
      <TargetPopover
        align={PopoverAlign.START}
        {...popoverProps}
        contentRenderer={menu}
      >
        <InlineButton text={i18n('AddTranslationButton.Text')} icon={addIcon} />
      </TargetPopover>
    );
  }
}

export { TranslationSelector };
