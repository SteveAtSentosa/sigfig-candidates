import _ from 'lodash';
import { func, bool, shape, number, string, oneOf, arrayOf, oneOfType } from 'prop-types';

import { Survey } from 'Constants';
import { I18Content } from './Common';
import { OrganizationSchedule } from './Organizations';

const AnswerType = oneOf(_.values(Survey.QuestionCommonTypes));

export const Driver = shape({
  id: oneOfType([number, string]).isRequired,
  name: I18Content.isRequired,
  benchmark: number,
  organization: number,
  targetFilter: arrayOf(string),

  isCustom: bool,
  isDefault: bool,
  getName: func,
  getTooltip: func,
});

export const DriverList = arrayOf(Driver);

export const Choice = shape({
  id: number.isRequired,
  content: I18Content.isRequired,
});

export const ChoiceList = arrayOf(Choice);

export const Question = shape({
  id: number.isRequired,
  driver: number,
  content: I18Content.isRequired,
  choices: ChoiceList,
  benchmark: number,
  answerType: AnswerType,
  individualAdvice: I18Content,
  segmentAdvice: I18Content,
  isCustom: bool,
  isDefault: bool,
  getContent: func,
});

export const QuestionList = arrayOf(Question);

const AnswerValueType = oneOfType([number, arrayOf(number), string]);

export const Answer = shape({
  answer: AnswerValueType,
  answerId: number,
  answerType: AnswerType.isRequired,
  answerDate: number,
  questionId: number.isRequired,
});

export const AnswerList = arrayOf(Answer);

const SurveyStatistic = shape({
  lastSurveyStart: number,
  lastSurveyParticipationTotal: number,
  lastSurveyParticipationActive: number,
});

export const CustomSurvey = shape({
  id: number.isRequired,
  name: string.isRequired,
  organization: number.isRequired,
  questions: arrayOf(number).isRequired,
  schedules: arrayOf(OrganizationSchedule).isRequired,
  state: oneOf(['active', 'draft', 'closed']),
  accessToSegmentsReport: bool,
  createdAt: number.isRequired,
  statistic: SurveyStatistic,
});

export const CustomSurveyList = arrayOf(CustomSurvey);
