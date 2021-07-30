import React from 'react';
import PropTypes from 'prop-types';

import { Survey } from 'Constants/index';
import { withTranslation } from 'utilities/decorators';

import {
  oneToFiveIcon,
  multipleChoiceIcon,
  textIcon,
  npsIcon,
} from 'images/icons/question-types';

import { SectionActionButton, TargetPopover, PopoverAlign } from 'Components/Common';

import * as Own from './AddQuestionButton.Components';

@withTranslation('CustomSurveysPage.ActionButtons.AddQuestion')
class AddQuestionButton extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onQuestionAdd: PropTypes.func.isRequired,
  }

  state = {
    isPopoverOpen: false,
  }

  handleQuestionTypeButtonClick = (questionType) => {
    const { onQuestionAdd } = this.props;
    onQuestionAdd(questionType);

    this.setState({ isPopoverOpen: false });
  }

  handleTargetButtonClick = () => {
    this.setState(state => ({
      isPopoverOpen: !state.isPopoverOpen,
    }));
  }

  handlePopoverClose = () => {
    this.setState({ isPopoverOpen: false });
  }

  handlePopoverInteraction = (nextOpenState) => {
    this.setState({ isPopoverOpen: nextOpenState });
  }

  contentRenderer = ({ closePopup }) => {
    const { i18n } = this.props;
    return (
      <Own.Content>
        <Own.ContentRow>
          <Own.QuestionTypeButton onClick={() => {
            this.handleQuestionTypeButtonClick(Survey.QuestionCommonTypes.Range5);
            closePopup();
          }}
          >
            <Own.QuestionTypeIcon source={oneToFiveIcon} />

            <Own.QuestionTypeButtonContent>
              <Own.QuestionTypeTitle>
                {i18n('QuestionTypes.OneToFive.Title')}
              </Own.QuestionTypeTitle>
              <Own.QuestionTypeDescription>
                {i18n('QuestionTypes.OneToFive.Description')}
              </Own.QuestionTypeDescription>
            </Own.QuestionTypeButtonContent>
          </Own.QuestionTypeButton>

          <Own.QuestionTypeButton onClick={() => {
            this.handleQuestionTypeButtonClick(Survey.QuestionCommonTypes.MultiChoice);
            closePopup();
          }}
          >
            <Own.QuestionTypeIcon source={multipleChoiceIcon} />

            <Own.QuestionTypeButtonContent>
              <Own.QuestionTypeTitle>
                {i18n('QuestionTypes.MultipleChoice.Title')}
              </Own.QuestionTypeTitle>
              <Own.QuestionTypeDescription>
                {i18n('QuestionTypes.MultipleChoice.Description')}
              </Own.QuestionTypeDescription>
            </Own.QuestionTypeButtonContent>
          </Own.QuestionTypeButton>
        </Own.ContentRow>

        <Own.ContentRow>
          <Own.QuestionTypeButton onClick={() => {
            this.handleQuestionTypeButtonClick(Survey.QuestionCommonTypes.Text);
            closePopup();
          }}
          >
            <Own.QuestionTypeIcon source={textIcon} />

            <Own.QuestionTypeButtonContent>
              <Own.QuestionTypeTitle>
                {i18n('QuestionTypes.Text.Title')}
              </Own.QuestionTypeTitle>
              <Own.QuestionTypeDescription>
                {i18n('QuestionTypes.Text.Description')}
              </Own.QuestionTypeDescription>
            </Own.QuestionTypeButtonContent>
          </Own.QuestionTypeButton>

          <Own.QuestionTypeButton onClick={() => {
            this.handleQuestionTypeButtonClick(Survey.QuestionCommonTypes.Range10);
            closePopup();
          }}
          >
            <Own.QuestionTypeIcon source={npsIcon} />

            <Own.QuestionTypeButtonContent>
              <Own.QuestionTypeTitle>
                {i18n('QuestionTypes.NPS.Title')}
              </Own.QuestionTypeTitle>
              <Own.QuestionTypeDescription>
                {i18n('QuestionTypes.NPS.Description')}
              </Own.QuestionTypeDescription>
            </Own.QuestionTypeButtonContent>
          </Own.QuestionTypeButton>
        </Own.ContentRow>
      </Own.Content>
    );
  }

  render() {
    const { i18n, disabled } = this.props;

    return (
      <TargetPopover
        onClose={this.handlePopoverClose}
        onInteraction={this.handlePopoverInteraction}
        align={PopoverAlign.END}
        contentRenderer={this.contentRenderer}
      >
        <SectionActionButton
          dropdown
          disabled={disabled}
          title={i18n('Text')}
          onClick={this.handleTargetButtonClick}
          data-cy="AddQuestion"
        />
      </TargetPopover>
    );
  }
}

export { AddQuestionButton };
