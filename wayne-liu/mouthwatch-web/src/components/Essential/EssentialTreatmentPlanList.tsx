import * as React from 'react'

import { EssentialModal, UpgradeSubscriptionContainer } from '#/components/EssentialModal'

import { Account } from '#/types'
import ActionMenu from '#/pages/Patients/TreatmentPlanBuilder/TreatmentPlanListMenu'
import Button from '#/components/Button'
import CollapsibleSection from '#/components/CollapsibleSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Table from '#/components/Table'
import { TreatmentPlanEntity } from '#/api'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { getUTCDateString } from '#/utils'

const styles = require('#/pages/Patients/TreatmentPlanBuilder/list.scss')

const EssentialTreatmentPlanList: React.FC = () => {
  return (
    <div style={{ position: 'relative', height: '75%' }}>
      <div className={styles.list}>
        <div className={styles.button_container}>
          <Link to='#'>
            <Button>
              <div className={styles.button_content}>
                <FontAwesomeIcon icon={faPlus} className={styles.button_icon} /> <span>Create New Treatment Plan</span>
              </div>
            </Button>
          </Link>
        </div>
        <div className={styles.table_container}>
          <CollapsibleSection title='Treatment Plans' hideButton>
            <EssentialTreatmentPlanTable />
          </CollapsibleSection>
        </div>
      </div>
      <UpgradeSubscriptionContainer>
        <EssentialModal
          image={'/static/images/essentialModal/treatment_plan.png'}
          title={
            <div>
              Create Visual Treatment Plans with
              <br /> <strong>TeleDent Professional</strong>
            </div>
          }
          description={'Upgrade to Professional to create powerful treatment plans that incorporate images, clinical recommendations and more, resulting in greater case understanding and acceptance.'}
          copy={['Add Images and X-Rays', 'Propose Fees and Codes', 'Easily Share']}
        />
      </UpgradeSubscriptionContainer>
    </div>
  )
}

export default EssentialTreatmentPlanList

const fakeTreatmentPlans = [
  {
    'id': '1',
    'created_at': '2020-03-18T16:37:32.400Z',
    'created_by': {
      'id': '667e7829-03b0-4575-9a54-854163b7fe89',
      'properties': {},
      'first_name': 'Andrew',
      'last_name': 'Admin',
      'display_name': 'Batman'
    }
  },
  {
    'id': '2',
    'created_at': '2020-03-18T16:37:32.400Z',
    'created_by': {
      'id': '667e7829-03b0-4575-9a54-854163b7fe89',
      'properties': {},
      'first_name': 'Andrew',
      'last_name': 'Admin',
      'display_name': 'Batman'
    }
  },
  {
    'id': '3',
    'created_at': '2020-03-18T16:37:32.400Z',
    'created_by': {
      'id': '667e7829-03b0-4575-9a54-854163b7fe89',
      'properties': {},
      'first_name': 'Andrew',
      'last_name': 'Admin',
      'display_name': 'Batman'
    }
  },
  {
    'id': '4',
    'created_at': '2020-04-06T16:37:32.400Z',
    'created_by': {
      'id': '667e7829-03b0-4575-9a54-854163b7fe89',
      'properties': {},
      'first_name': 'Andrew',
      'last_name': 'Admin',
      'display_name': 'Batman'
    }
  },
  {
    'id': '5',
    'created_at': '2020-06-12T16:37:32.400Z',
    'created_by': {
      'id': '667e7829-03b0-4575-9a54-854163b7fe89',
      'properties': {},
      'first_name': 'Andrew',
      'last_name': 'Admin',
      'display_name': 'Batman'
    }
  }
]

const EssentialTreatmentPlanTable = () => {
  return(
    <Table
      columns={columns}
      name='treatment plans'
      actionColumnName={' '}
      actionColumn={viewButton}
      data={fakeTreatmentPlans}
      defaultSortByAccessor={'created_at'}
      className={`treatment_plan_table ${styles.tp_table}`}
    />
  )
}

const columns = [
  {
    name: 'Date',
    accessor: 'created_at',
    renderCell: (date: string) => {
      return <div>{getUTCDateString(date)}</div>
    }
  },
  {
    name: 'Title',
    accessor: 'name',
    renderCell: (title: string, rowData: TreatmentPlanEntity) => {
      const isDraft = rowData.status === 'Draft'
      return (
        <div className={styles.title}>
          {title} {isDraft && <div className={styles['Draft']}>Draft</div>}
        </div>
      )
    }
  },
  {
    name: 'Creator',
    accessor: 'created_by',
    renderCell: (createdby: Account) => {
      return (
        <span>{`${createdby.first_name} ${createdby.last_name}`}</span>
      )
    }
  }
]

const viewButton = (rowData: any, isOpen?: boolean, openMenu?: () => void) => {
  return (
    <ActionMenu rowData={rowData} isOpen={isOpen} openMenu={openMenu} patientId='' />
  )
}
