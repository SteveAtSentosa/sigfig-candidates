import * as React from 'react'

import { CleaveInput, SelectInput, TextInput } from '#/components/Form/Input'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Option, PracticeLocation } from '#/types'

import { AddressFields } from '#/components/AdminTools/AddressFields'
import Field from '#/components/Form/Field'
import Label from '#/components/Form/Label'
import { RequiredIndicator } from '#/components/Form/RequiredIndicator'
import { isWebUri } from 'valid-url'
import { validatePhoneNo } from '#/utils'
import validator from 'validator'

const styles = require('#/components/AdminTools/styles.scss')

const validate = (values) => {
  let errors: typeof values = {}

  if (!values.group_id) {
    errors.group_id = 'Required'
  }

  if (!values.name) {
    errors.name = 'Required'
  }

  // validate URL (http | https)
  if (values.url && !isWebUri(values.url)) {
    errors.url = 'Please enter a valid URL (http:// or https:// only)'
  }

  // validate phone number
  if (values.phone && !validatePhoneNo(values.phone)) {
    errors.phone = 'Please enter a valid phone number '
  }

  if (values.zip_code && !validator.isPostalCode(values.zip_code, 'US')) {
    errors.zip_code = 'Please enter a valid US zip code'
  }

  return errors
}

interface FormProps {
  practiceOptions: Option[]
}

interface OwnProps {
  location?: PracticeLocation
}

class LocationForm extends React.PureComponent<OwnProps & FormProps & InjectedFormProps> {
  render () {
    const { handleSubmit, practiceOptions } = this.props
    return (
      <form id={this.props.form} className={styles.form} onSubmit={handleSubmit}>
        <h5 className={styles.sectionTitle}>Details</h5>
        <div className={styles.sectionDetails}>
          <div className={styles.row}>
            <div className={styles.locationName}>
              <Label>Location Name<RequiredIndicator /></Label>
              <Field
                name='name'
                component={TextInput}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.practiceName}>
              <Label>Practice</Label>
              <Field
                isDisabled
                value={(this.props.initialValues as any).practices}
                name='practices'
                onBlur={() => true}
                component={SelectInput}
                options={practiceOptions}
              />
            </div>
          </div>
          <AddressFields />
          <div className={styles.row}>
            <div className={styles.website}>
              <Label>Website</Label>
              <Field
                name='url'
                component={CleaveInput}
                options={{
                  prefix: 'http://'
                }}
                normalize={value => value === 'http://' ? '' : value}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default reduxForm<any, any>({
  validate,
  enableReinitialize: true
})(LocationForm)
