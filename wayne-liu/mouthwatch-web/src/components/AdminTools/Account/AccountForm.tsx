import * as React from 'react'

import { InjectedFormProps, reduxForm } from 'redux-form'

import { AddressFields } from '#/components/AdminTools/AddressFields'
import Field from '#/components/Form/Field'
import { Group } from '#/types'
import Label from '#/components/Form/Label'
import { LogoTitle } from '#/components/AdminTools/LogoTitle'
import { LogoUpload } from '#/components/AdminTools/Account'
import { TextInput } from '#/components/Form/Input'
import { validatePhoneNo } from '#/utils'
import validator from 'validator'

const styles = require('#/components/AdminTools/styles.scss')

const validate = (values) => {
  const errors: typeof values = {}

  if (!values.name) {
    errors.name = 'Required'
  }

  if (values.phone && !validatePhoneNo(values.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (values.zip_code && !validator.isPostalCode(values.zip_code, 'US')) {
    errors.zip_code = 'Please enter a valid US zip code'
  }

  if (values.picture) {
    const filesize = Number.parseFloat(((values.picture.size / 1024) / 1024).toFixed(2))
    if (filesize > 2) {
      errors.picture = 'File is too big'
    }
  }

  return errors
}

interface FormValues {
  name: string
  phone: string
  licenses: string
  picture: File | string
  address1: string
  address2: string
  city: string
  state: string
  zip_code: string
}

interface FormProps {
  group?: Group
  showUpdateLogoTooltip?: boolean
}

class AccountForm extends React.PureComponent<InjectedFormProps<FormValues, FormProps> & FormProps> {
  onFileChosen = (value) => {
    this.props.change('picture', value)
  }

  get uploadLogoText () {
    if (!this.props.group || (this.props.group && this.props.group.media.length === 0)) {
      return 'Upload Logo'
    } else {
      return 'Update Logo'
    }
  }

  render () {
    const { group, showUpdateLogoTooltip } = this.props
    return (
      <form id={this.props.form} className={styles.form} onSubmit={this.props.handleSubmit}>
        <LogoTitle showUpgradeTooltip={showUpdateLogoTooltip} entity={group} entityLabel='Account' onFileChosen={this.onFileChosen} />
        <h5 className={styles.sectionTitle}>Details</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            <div className={styles.groupName}>
              <Label>Account Name</Label>
              <Field
                name='name'
                component={TextInput}
              />
            </div>
          </div>
          { (!group || (group && group.media.length === 0)) &&
            <>
              <div className={styles.row}>
                <LogoUpload
                  onFileChosen={this.onFileChosen}
                  uploadLogoText={this.uploadLogoText}
                />
              </div>
              <div className={styles.row}>
                <Label>Maximum upload: 2MB. Recommended 200x75px</Label>
              </div>
            </>
          }
          <AddressFields />
          {
            group && group.group_license &&
            <div className={styles.row}>
              <div className={styles.totalAccounts}>
                <Label>Total Users: </Label>
                <span>{group.group_license.licenses_used}</span>
              </div>
            </div>
          }
        </div>
      </form>
    )
  }
}

export default reduxForm<FormValues, FormProps>({
  validate,
  enableReinitialize: true
})(AccountForm)
