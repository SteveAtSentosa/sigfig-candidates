import * as React from 'react'
import Label from '#/components/Form/Label'
import Field from '#/components/Form/Field'
import { removeUSACountryCode } from '#/utils'
import { TextInput, CleaveInput, CleaveZipCodeInput } from '#/components/Form/Input'

const styles = require('./addressFields.scss')

export const AddressFields = () => {
  return (
    <>
      <div className={styles.row}>
        <div className={styles.address1}>
          <Label>Address 1</Label>
          <Field
            name='address1'
            component={TextInput}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.address2}>
          <Label>Suite, Unit, Floor, etc.</Label>
          <Field
            name='address2'
            component={TextInput}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.city}>
          <Label>City</Label>
          <Field
            name='city'
            component={TextInput}
          />
        </div>
        <div className={styles.state}>
          <Label>State</Label>
          <Field
            name='state'
            component={TextInput}
          />
        </div>
        <div className={styles.zip}>
          <Label>Zip Code</Label>
          <Field
            name='zip_code'
            component={CleaveZipCodeInput}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.phone}>
          <Label>Phone</Label>
          <Field
            name='phone'
            component={CleaveInput}
            format={removeUSACountryCode}
            normalize={removeUSACountryCode}
            placeholder='###-###-####'
          />
        </div>
      </div>
    </>
  )
}
