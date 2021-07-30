const AcknowledgeFilterType = {
  All: null,
  Yes: true,
  No: false,
};

const ReplyFilterType = {
  All: null,
  Replied: 0,
  RepliedByMe: 1,
  Unreplied: 2,
};

const ReadFilterType = {
  All: null,
  Read: 0,
  Unread: 1,
};

const LabelsFilterType = {
  All: null,
  Important: 3,
  FollowUp: 2,
  Idea: 1,
  NoLabel: 0,
};

const Labels = {
  No: 0,
  Idea: 1,
  FollowUp: 2,
  Important: 3,
};

const LabelColors = {
  Important: '#82e59f',
  FollowUp: '#f4bd3b',
  Idea: '#f68e7e',
  NoLabel: '#98a6bc',
};

const SortByOptions = {
  Unread: 0,
  Newest: 1,
  Oldest: 2,
};

export default {
  AcknowledgeFilterType,
  ReplyFilterType,
  ReadFilterType,
  LabelsFilterType,
  Labels,
  LabelColors,
  SortByOptions,
};
