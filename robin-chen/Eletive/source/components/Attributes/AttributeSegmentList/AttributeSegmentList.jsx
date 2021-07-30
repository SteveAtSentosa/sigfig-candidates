import React from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';

import { withTranslation } from 'utilities/decorators';
import { fuzzyFilterSortList } from 'utilities/lists';
import { deleteBinIcon, editIcon, starIcon, userIcon } from 'images/icons/common';

import { AttributeTypes } from 'Constants/Attributes';
import * as AttributeModels from 'Models/Attributes';

import { ActionMenu, ListBlock, SidePanel, SortableTable, SortableTableCommons } from 'Components/Common';
import { EmployeeListView } from './EmployeeListView/EmployeeListView';
import { ManagerListViewContainer } from './ManagerListView/ManagerListView.Container';
import { SegmentNameEdit } from './SegmentNameEdit/SegmentNameEdit';

import { SegmentName } from './SegmentName';
import { SegmentDeleteConfirmationAlert } from './SegmentDeleteConfirmationAlert/SegmentDeleteConfirmationAlert';
import * as Own from './AttributeSegmentList.Components';

@withTranslation('AttributeSegmentList')
class AttributeSegmentList extends React.PureComponent {
  static propTypes = {
    filterText: PropTypes.string,
    attribute: AttributeModels.Attribute.isRequired,
    onAttributeUpdate: PropTypes.func.isRequired,
  }

  state = {
    managerListSegment: null,
    managerListVisible: false,
    employeeListSegment: null,
    employeeListVisible: false,
    segmentMarkedToDelete: null,
    segmentForEdit: null,
  }

  get isChoiceAttribute() {
    const { attribute } = this.props;
    return attribute.type === AttributeTypes.Choices;
  }

  get columns() {
    const { i18n } = this.props;
    const columns = [
      {
        key: 'name',
        title: i18n('Columns.Name'),
        style: {
          width: '40%',
        },
      },
      {
        key: 'employees',
        title: i18n('Columns.Employees'),
        style: {
          width: this.isChoiceAttribute ? '25%' : '60%',
        },
      },
    ];
    if (this.isChoiceAttribute) {
      columns.push(
        {
          key: 'managers',
          title: i18n('Columns.Managers'),
          style: {
            width: '25%',
          },
        },
        {
          key: 'actions',
          title: i18n('Columns.Actions'),
          style: {
            width: '10%',
          },
        },
      );
    }
    return columns;
  }

  get segments() {
    const { attribute, filterText } = this.props;

    return fuzzyFilterSortList(attribute.segments, filterText, item => item.name);
  }

  handleSegmentDeleteButtonClick = segment => () => {
    this.setState({
      segmentMarkedToDelete: segment,
    });
  }

  handleSegmentCancelDelete = () => {
    this.setState({
      segmentMarkedToDelete: null,
    });
  }

  handleSegmentConfirmDelete = () => {
    const { attribute, onAttributeUpdate } = this.props;
    const { segmentMarkedToDelete } = this.state;

    const updatedSegmentList = attribute.segments.filter(segment => (
      segment.value !== segmentMarkedToDelete.value
    ));

    onAttributeUpdate({ ...attribute, segments: updatedSegmentList });

    this.setState({
      segmentMarkedToDelete: null,
    });
  }

  handleEditSegmentClick = segmentForEdit => () => {
    this.setState({ segmentForEdit });
  }

  handleEmployeeListLinkClick = segment => () => {
    this.setState({
      employeeListSegment: segment,
      employeeListVisible: true,
    });
  }

  handleManagerListLinkClick = segment => () => {
    this.setState({
      managerListSegment: segment,
      managerListVisible: true,
    });
  }

  handleAttributeEmployeeListClose = () => {
    this.setState({
      employeeListVisible: false,
    });
  }

  handleAttributeManagerListClose = () => {
    this.setState({
      managerListSegment: null,
      managerListVisible: false,
    });
  }

  handleSegmentManagerAdd = (user) => {
    this.setState((state) => {
      const { managerListSegment } = state;
      const { managers } = managerListSegment;

      return {
        managerListSegment: {
          ...managerListSegment,
          managers: [...managers, user.id],
        },
      };
    });
  }

  handleSegmentManagerDelete = (manager) => {
    this.setState((state) => {
      const { managerListSegment } = state;
      const { managers } = managerListSegment;

      return {
        managerListSegment: {
          ...managerListSegment,
          managers: managers.filter(managerID => managerID !== manager.id),
        },
      };
    });
  }

  handleSegmentNameChange = (segment, name) => {
    const { attribute, onAttributeUpdate } = this.props;

    const updatedSegmentList = produce(attribute.segments, (draft) => {
      const index = draft.findIndex(item => (
        item.value === segment.value
      ));
      if (index !== -1) {
        const segmentUpdated = draft[index];
        segmentUpdated.name = name;
      }
    });

    onAttributeUpdate({ ...attribute, segments: updatedSegmentList })
      .then(() => {
        this.setState({
          segmentForEdit: null,
        });
      });
  }

  handleSegmentNameChangeCancel = () => {
    this.setState({ segmentForEdit: null });
  }

  renderSegmentRow = (segment, columns) => {
    const {
      i18n,
      attribute,
    } = this.props;

    const actionItems = [
      {
        title: i18n('Actions.Employees'),
        icon: userIcon,
        onClick: this.handleEmployeeListLinkClick(segment),
      },
      {
        title: i18n('Actions.Managers'),
        icon: starIcon,
        onClick: this.handleManagerListLinkClick(segment),
      },
      {
        title: i18n('Actions.Edit'),
        icon: editIcon,
        onClick: this.handleEditSegmentClick(segment),
      },
      {
        title: i18n('Actions.Delete'),
        icon: deleteBinIcon,
        onClick: this.handleSegmentDeleteButtonClick(segment),
      },
    ];

    return (
      <>
        <SortableTableCommons.RowCell style={columns[0].style}>
          <SegmentName
            name={segment.name}
            attribute={attribute}
          />
        </SortableTableCommons.RowCell>
        <SortableTableCommons.RowCell style={columns[1].style}>
          <Own.ListLink
            count={segment.userCount}
            onClick={this.handleEmployeeListLinkClick(segment)}
          />
        </SortableTableCommons.RowCell>
        {
          this.isChoiceAttribute &&
          <>
            <SortableTableCommons.RowCell style={columns[2].style}>
              <Own.ListLink
                count={segment.managersCount}
                onClick={this.handleManagerListLinkClick(segment)}
              />
            </SortableTableCommons.RowCell>

            <SortableTableCommons.RowCell style={columns[3].style}>
              <ActionMenu popoverProps={{ position: 'bottom', align: 'end' }} items={actionItems} />
            </SortableTableCommons.RowCell>
          </>
        }
      </>
    );
  }

  render() {
    const { i18n, attribute } = this.props;

    const {
      managerListSegment,
      managerListVisible,
      employeeListSegment,
      employeeListVisible,
      segmentMarkedToDelete,
      segmentForEdit,
    } = this.state;

    return (
      <Own.Container>
        <ListBlock>
          <Own.SortableTableWrapper>
            <SortableTable
              hideHeaderOnMobile
              keyField="id"
              columns={this.columns}
              items={this.segments}
              rowRenderer={this.renderSegmentRow}
            />
          </Own.SortableTableWrapper>
        </ListBlock>

        {this.isChoiceAttribute &&
        <SegmentNameEdit
          segment={segmentForEdit}
          onChange={this.handleSegmentNameChange}
          onCancel={this.handleSegmentNameChangeCancel}
        />
        }

        <SidePanel
          scrollable
          isOpen={employeeListVisible}
          header={i18n('EmployeeList.Header', {
            segmentName: employeeListSegment?.name || '',
            employeeCount: employeeListSegment?.userCount || 0,
          })}
          onClose={this.handleAttributeEmployeeListClose}
        >
          <EmployeeListView
            attribute={attribute}
            segment={employeeListSegment}
          />
        </SidePanel>

        <SidePanel
          scrollable
          isOpen={managerListVisible}
          header={i18n('ManagerList.Header')}
          onClose={this.handleAttributeManagerListClose}
        >
          <ManagerListViewContainer
            segment={managerListSegment}
            attribute={attribute}
            onSegmentManagerAdd={this.handleSegmentManagerAdd}
            onSegmentManagerDelete={this.handleSegmentManagerDelete}
          />
        </SidePanel>

        <SegmentDeleteConfirmationAlert
          segment={segmentMarkedToDelete}
          onCancelDelete={this.handleSegmentCancelDelete}
          onConfirmDelete={this.handleSegmentConfirmDelete}
        />
      </Own.Container>
    );
  }
}

export { AttributeSegmentList };
