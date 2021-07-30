/* eslint max-lines: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import { connect } from 'react-redux';

import { actions } from 'store';
import { withTranslation } from 'utilities/decorators';
import { csvToArray } from 'utilities/csvToArray';
import { generateCsvAndDownload } from 'utilities/export';

import * as AttributeModels from 'Models/Attributes';
import * as UserModels from 'Models/Users';
import { downloadIcon, exclamationIcon } from 'images/icons/common';
import {
  fieldEmailIcon,
  fieldLanguageIcon,
  fieldNameUserIcon,
  fieldAttributeIcon,
  massEditImportedIcon,
  massEditUpdatedIcon,
  massEditCreatedIcon,
} from 'images/settings';
import {
  Alert,
  AlertIntent,
  Line,
  Modal,
  MarkdownContent,
  SectionTitle,
  SubSectionTitle,
  ProgressBar,
  Dialog,
  InlineButton,
  RoundedButton,
  RoundedButtonIntent,
} from 'Components/Common';
import { processReadedData } from './BatchCreateUsers.service';
import * as Own from './BatchCreateUsers.Components';

@withTranslation('BatchCreateUsers')
class BatchCreateUsers extends React.PureComponent {
  state = {
    importMessages: [],
    segmentsToAdd: [],
    usersData: [],
    readedRowEmail: {},
    readedRowsCount: 0,
    showPreImportDialog: false,
    showProcessDialog: false,
    showResultsDialog: false,
    showError: false,
    errorText: '',
    resultErrors: [],
    resultAffected: { updated: 0, created: 0 },
    resultUsers: [],
  };

  static propTypes = {
    className: PropTypes.string,
    attributeList: AttributeModels.AttributeList,
    userList: UserModels.UserList,
    fetchAttributeList: PropTypes.func,
    updateAttribute: PropTypes.func,
    batchUpdateUsers: PropTypes.func,
  };

  componentDidMount() {
    const { fetchAttributeList } = this.props;
    fetchAttributeList();
  }

  processImport = async () => {
    const { usersData } = this.state;
    const { attributeList, batchUpdateUsers } = this.props;
    this.setState({ showPreImportDialog: false, showProcessDialog: true });

    await this.addNewSegments();

    usersData.forEach((user) => {
      user.attributes.forEach((userAttributeItem) => {
        const userAttribute = userAttributeItem;
        if (userAttribute.addSegment) {
          const attribute = attributeList.find(attr => attr.id === userAttribute.id);
          const { segments } = attribute;
          const segment = segments.find(item => item.name === userAttribute.addSegment);
          userAttribute.value = segment.value;
          delete userAttribute.addSegment;
        }
      });
    });

    const maxUserCountPerRequest = 1000;

    if (usersData.length > maxUserCountPerRequest) {
      const countParts = Math.ceil(usersData.length / maxUserCountPerRequest);

      Promise.all([...Array(countParts)]
        .map((e, i) => batchUpdateUsers(usersData
          .slice(i * maxUserCountPerRequest, (i + 1) * maxUserCountPerRequest))))
        .then((responses) => {
          const combinedResponse = responses.reduce((accumulator, { users, errors, affected }) => {
            accumulator.users.push(...users);
            accumulator.errors.push(...errors);
            accumulator.affected.updated += affected.updated;
            accumulator.affected.created += affected.created;
            return accumulator;
          }, { users: [], errors: [], affected: { updated: 0, created: 0 } });

          this.handleBatchUpdateResponse(combinedResponse);
        });
    } else {
      batchUpdateUsers(usersData)
        .then(response => this.handleBatchUpdateResponse(response));
    }
  };

  addNewSegments = () => {
    const { segmentsToAdd } = this.state;
    const { attributeList, updateAttribute } = this.props;

    if (!segmentsToAdd.length) {
      return Promise.resolve();
    }

    return Promise.all(segmentsToAdd.map(({ attribute: { id: attributeID }, segments }) => {
      const attribute = attributeList.find(attr => attr.id === attributeID);
      const maxValue = attribute.segments.reduce((a, c) => (c.value > a ? c.value : a), 0) + 1;
      attribute.segments.push(
        ...segments.map((name, index) => ({
          name,
          value: maxValue + index,
          valueUpTo: maxValue + index,
        })),
      );
      return updateAttribute(attribute);
    }));
  };

  handleInputFile = (acceptedFiles) => {
    const { i18n } = this.props;

    this.setState({
      resultErrors: [],
      resultAffected: { updated: 0, created: 0 },
      resultUsers: [],
    });
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result;
      const readedData = csvToArray(text, ';');

      const result = processReadedData(readedData);

      if (typeof result === 'string') {
        this.setState({
          showError: true,
          errorText: i18n(result),
        });
        return;
      }

      this.setState(result);

      if (result.importMessages.length) {
        this.setState({ showPreImportDialog: true });
      } else {
        this.processImport();
      }
    };

    reader.readAsText(file, 'cp1252');
  };

  handlePreImportDialogClose = () => {
    this.setState({ showPreImportDialog: false });
  };

  handleResultsDialogClose = () => {
    this.setState({ showResultsDialog: false });
  };

  handleErrorClose = () => {
    this.setState({
      showError: false,
      errorText: '',
    });
  };

  handleBatchUpdateResponse =({ users, errors, affected }) => {
    const { resultErrors, readedRowEmail } = this.state;
    this.setState({
      showProcessDialog: false,
      showResultsDialog: true,
      resultErrors: [...resultErrors, ...errors.map(error => ({
        row: readedRowEmail[error.email],
        email: error.email,
        error: error.error,
      }))],
      resultAffected: affected,
      resultUsers: users,
    });
  };

  handleDownloadErrors = () => {
    const { i18n } = this.props;
    const { resultErrors } = this.state;
    this.setState({ showResultsDialog: false });
    generateCsvAndDownload(
      resultErrors
        .sort((a, b) => {
          if (a.row === b.row) {
            return 0;
          }
          return a.row > b.row ? 1 : -1;
        })
        .map(error => ({
          'Row number': error.row,
          Email: error.email || 'Empty',
          Message: i18n(`Errors.${error.error}`),
        })),
      'Eletive Error log',
      ['Row number', 'Email', 'Message'],
    );
  };

  handleDownloadCreateTemplate =() => {
    const { attributeList } = this.props;
    const exampleUser = {
      Email: 'examplename.exlastname@eletive.com',
      'First name': 'Examplename',
      'Last name': 'Exlastname',
      Language: 'en',
    };

    const fields = ['Email', 'First name', 'Last name', 'Language'];

    attributeList.forEach((attribute) => {
      fields.push(attribute.name);
      if (attribute.type === 0) {
        exampleUser[attribute.name] = (attribute.segments[0] || {}).name || 'Segment name';
      } else if (attribute.type === 1) {
        exampleUser[attribute.name] = moment().format('YYYY-MM-DD');
      } else if (attribute.type === 2) {
        exampleUser[attribute.name] = 107.65;
      }
    });

    generateCsvAndDownload([exampleUser], 'Eletive Create users template', fields);
  };

  handleDownloadEditTemplate = () => {
    const { attributeList, userList } = this.props;
    const fields = ['Email', 'First name', 'Last name', 'Language'];
    attributeList.forEach((attribute) => {
      fields.push(attribute.name);
    });
    const usersData = userList
      .map((user) => {
        const ret = {
          Email: user.email,
          'First name': user.firstName,
          'Last name': user.lastName,
          Language: user.language,
        };

        user.attributes.forEach(({ id, value }) => {
          const curAttribute = attributeList.find(item => item.id === id);
          if (!curAttribute) {
            return;
          }
          if (curAttribute.type === 0) {
            const segment = curAttribute.segments.find(item => item.value === value) || {};
            ret[curAttribute.name] = segment.name || '';
          } else if (curAttribute.type === 1) {
            ret[curAttribute.name] = moment.unix(value).format('YYYY-MM-DD');
          } else if (curAttribute.type === 2) {
            ret[curAttribute.name] = value;
          }
        });
        return ret;
      });

    generateCsvAndDownload(usersData, 'Eletive Edit users template', fields);
  };


  render() {
    const { i18n } = this.props;
    const {
      showPreImportDialog,
      showProcessDialog,
      showResultsDialog,
      readedRowsCount,
      importMessages,
      resultErrors,
      resultAffected,
      resultUsers,
      showError,
      errorText,
    } = this.state;

    return (
      <div>
        <Own.IntroductionContainer>
          <div>
            <SectionTitle title={i18n('Instruction.Title')} />
            <MarkdownContent source={i18n('Instruction.Intro')} />
          </div>
          <Own.MassEditIcon />
        </Own.IntroductionContainer>

        <SubSectionTitle title={i18n('Instruction.InstructionsTitle')} />
        <MarkdownContent source={i18n('Instruction.InstructionsIntro')} />
        <Own.Container>
          <Own.FieldDescription icon={fieldEmailIcon} title="Email">
            {i18n('Instruction.EmailText')}
          </Own.FieldDescription>
          <Own.FieldDescription icon={fieldNameUserIcon} title="First name and Last name">
            {i18n('Instruction.NamesText')}
          </Own.FieldDescription>
        </Own.Container>
        <Own.Container>
          <Own.FieldDescription icon={fieldLanguageIcon} title="Language">
            {i18n('Instruction.LanguageText')}
          </Own.FieldDescription>
          <Own.FieldDescription icon={fieldAttributeIcon} title="Attributes">
            {i18n('Instruction.AttributesText')}
          </Own.FieldDescription>
        </Own.Container>


        <Line marginTop={40} />

        <Own.AllStepContainer>
          <SectionTitle title={i18n('Templates.Title1')} />
          <Own.Container>
            <Own.StepContainer>
              <SubSectionTitle title={i18n('Templates.SubTitleA')} />
              <MarkdownContent source={i18n('Templates.TextA')} />
              <Own.DownloadButton
                text={i18n('Templates.ButtonA')}
                onClick={this.handleDownloadCreateTemplate}
              />
            </Own.StepContainer>
            <Own.StepContainer>
              <SubSectionTitle title={i18n('Templates.SubTitleB')} />
              <MarkdownContent source={i18n('Templates.TextB')} />
              <Own.DownloadButton
                text={i18n('Templates.ButtonB')}
                onClick={this.handleDownloadEditTemplate}
              />
            </Own.StepContainer>
          </Own.Container>

          <SectionTitle title={i18n('Templates.Title2')} />
          <Dropzone onDrop={this.handleInputFile}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Own.Dropzone {...getRootProps()}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <div>{i18n('Dropzone.HelperText')}</div> :
                    <>
                      <Own.UploadIcon />
                      <SectionTitle title={i18n('Dropzone.InviteText')} />
                    </>
                }
              </Own.Dropzone>
            )}
          </Dropzone>
        </Own.AllStepContainer>


        <Dialog
          icon="info-sign"
          title={i18n('PreImportDialog.Title')}
          isOpen={showPreImportDialog}
          isCloseButtonShown={false}
        >
          <div>
            {
              importMessages.map(message => (
                <p key={message}>{message}</p>
              ))
            }
          </div>
          <div>
            <div>
              <RoundedButton
                text={i18n('PreImportDialog.CancelButton.Text')}
                onClick={this.handlePreImportDialogClose}
              />
              <RoundedButton
                text={i18n('PreImportDialog.ContinueButton.Text')}
                intent={RoundedButtonIntent.SUCCESS}
                onClick={this.processImport}
              />
            </div>
          </div>
        </Dialog>

        <Alert
          title={i18n('ProccessDialog.Title')}
          isOpen={showProcessDialog}
          icon={exclamationIcon}
          intent={AlertIntent.DANGER}
        >
          <Own.UploadContent>
            <MarkdownContent source={i18n('ProccessDialog.Text')} />
            <ProgressBar />
          </Own.UploadContent>
        </Alert>

        <Modal
          noPadding
          isOpen={showResultsDialog}
          isCloseButtonShown={false}
          onClose={this.handleResultsDialogClose}
        >
          <Own.UploadResultContainer>
            <Own.ModalTitle>{i18n('ResultsDialog.Title')}</Own.ModalTitle>

            <Own.UploadResultSummary>
              <Own.ResultDialogCard rows={resultUsers.length} label="Imported" icon={massEditImportedIcon} />
              <Own.ResultDialogCard rows={resultAffected.created} label="Created" icon={massEditCreatedIcon} />
              <Own.ResultDialogCard rows={resultAffected.updated} label="Updated" icon={massEditUpdatedIcon} />
            </Own.UploadResultSummary>

            <Own.UploadResult>
              {
                resultErrors.length ? (
                  <>
                    <span>{i18n('ResultsDialog.WarningText')}</span>
                    <MarkdownContent
                      source={i18n('ResultsDialog.WarningHelpText', { rows: readedRowsCount - resultUsers.length })}
                    />
                  </>
                ) : (
                  <>
                    <span>{i18n('ResultsDialog.SuccessText')}</span>
                    <MarkdownContent source={i18n('ResultsDialog.SuccessSubText')} />
                  </>
                )
              }
              {
                !!resultErrors.length &&
                <InlineButton
                  icon={downloadIcon}
                  text={i18n('ResultsDialog.DownloadButton.Text')}
                  onClick={this.handleDownloadErrors}
                />
              }
            </Own.UploadResult>
          </Own.UploadResultContainer>
        </Modal>

        <Alert
          isOpen={showError}
          intent={AlertIntent.DANGER}
          icon={exclamationIcon}
          title={<b>{errorText}</b>}
          onClose={this.handleErrorClose}
        />
      </div>
    );
  }
}

function mapStateToProps({ users, attributes }) {
  const { attributeList } = attributes;
  const { userList } = users;

  return {
    attributeList,
    userList,
  };
}

export default connect(mapStateToProps, {
  // TODO: actions.organizations not needed?
  ...actions.organizations,
  ...actions.attributes,
  ...actions.users,
})(BatchCreateUsers);
