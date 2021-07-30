import * as React from 'react'

import { InjectedFormProps, reduxForm } from 'redux-form'

import { AddressFields } from '#/components/AdminTools/AddressFields'
import Field from '#/components/Form/Field'
import { Group } from '#/types'
import Label from '#/components/Form/Label'
import { LogoTitle } from '#/components/AdminTools/LogoTitle'
import { LogoUpload } from '#/components/AdminTools/Account'
import { TextInput } from '#/components/Form/Input'
import isPostalCode from 'validator/lib/isPostalCode'
import { validatePhoneNo } from '#/utils'

const styles = require('#/components/AdminTools/styles.scss')

export const FormFieldMappings = {
  parent: 'parent_id',
  name: 'name',
  address1: 'address1',
  address2: 'address2',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  phone: 'phone'
}

interface FormValues {
  parent_id: {}
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
  practice?: Group
}

const validate = (values) => {
  const errors: typeof values = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  if (values.phone && !validatePhoneNo(values.phone)) {
    errors.phone = 'Please enter a valid phone number (XXX-XXX-XXXX)'
  }
  if (values.zip_code && !isPostalCode(values.zip_code, 'US')) {
    errors.zip_code = 'Please enter a valid US zip code'
  }
  if (values.picture) {
    const filesize = Number.parseFloat(((values.picture.size / 1024) / 1024).toFixed(2))
    if (filesize > 0.5) {
      errors.picture = 'File is too big'
    }
  }
  return errors
}

class PracticeForm extends React.PureComponent<InjectedFormProps<FormValues, FormProps> & FormProps> {
  onFileChosen = (value) => {
    this.props.change('picture', value)
  }

  get uploadLogoText () {
    if (!this.props.practice || (this.props.practice && this.props.practice.media.length === 0)) {
      return 'Upload Logo'
    } else {
      return 'Update Logo'
    }
  }

  render () {
    const { practice } = this.props

    return (
      <form id={this.props.form} className={styles.form} onSubmit={this.props.handleSubmit}>
        <LogoTitle entity={practice} entityLabel='Practice' onFileChosen={this.onFileChosen} />
        <h5 className={styles.sectionTitle}>Details</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            <div className={styles.practiceName}>
              <Label>Practice Name</Label>
              <Field
                name='name'
                component={TextInput}
              />
            </div>
          </div>
          { (!practice || (practice && practice.media.length === 0)) &&
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
        </div>
      </form>
    )
  }
}

export default reduxForm<FormValues, FormProps>({
  validate,
  enableReinitialize: true
})(PracticeForm)
