import * as React from 'react'

import { CheckboxInput, TextInput } from '#/components/Form/Input'
import { FormValues, Props, State } from './types'

import Button from '#/components/Button'
import Field from '#/components/Form/Field'
import SlateEditor from '#/components/SlateEditor'

const styles = require('#/components/AdminTools/styles.scss')

/*
 * NOTE: there seems to be a problem with reduxForm type declarations
 *  - if the FormValues interface contains a boolean, connection the validate function in the
 *  container will throw an error
 */
export const validate = (values: any) => {
  const errors: typeof values = {}
  return errors
}

/**
 * GroupConsentPolicyForm is not using the redux store for SlateEditor's value,
 * rather it has its own state which is write-only by SlateEditor,
 * and form values gets augmented with the updated policy upon submit.
 * See SlateEditor component for further explanation!
 */
class ConsentPolicyForm extends React.PureComponent<Props, State> {
  state: State = {
    policy: undefined
  }

  private handleEditorChange = (policy: string) => {
    this.setState({ policy })
  }

  /**
   * Add the consent_policy to the submitted form values
   * @param values Values from the redux-form
   */
  private addConsentPolicyToFormValues = (values: FormValues) =>
    this.props.onSubmit(Object.assign({}, values, { consent_policy: this.state.policy }))

  private setInitialPolicyState (values?: FormValues, prevValues?: FormValues) {
    if (!values || !values.consent_policy || this.state.policy) return
    if (!prevValues || !prevValues.consent_policy) {
      this.setState({ policy: values.consent_policy })
    }
  }

  private handleDelete = (e) => {
    e.preventDefault()
    this.props.onDelete(this.props.initialValues.id)
  }

  componentDidUpdate (props, prevProps) {
    this.setInitialPolicyState(props.initialValues, prevProps.initialValues)
  }

  render () {
    const { initialValues, form, handleSubmit, onDelete } = this.props

    return (
      <form
        id={form}
        className={styles.form}
        onSubmit={handleSubmit(this.addConsentPolicyToFormValues)}
      >
        <div className='row'>
          <div className='col-sm-6 col-lg-4'>
            <label>
              Policy Name / Language
            </label>
            <Field
              component={TextInput}
              name='language'
              required
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-8 col-lg-9'>
            <SlateEditor
              initialValue={initialValues.consent_policy}
              onChange={this.handleEditorChange}
              maxHeight='55vh'
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6 col-lg-4'>
            <label>
              Decline button text
            </label>
            <Field
              component={TextInput}
              name='decline_button_text'
              required
            />
          </div>
          <div className='col-sm-6 col-lg-4'>
            <label>
              Agree button text
            </label>
            <Field
              component={TextInput}
              name='agree_button_text'
              required
            />
          </div>
        </div>
        {
          initialValues.id &&
            <div className='row'>
              <div className='col-sm-6 col-lg-4'>
                <Field
                  component={CheckboxInput}
                  name='reconfirm'
                  type='checkbox'
                  checkboxClass={styles.checkbox}
                  text='Require existing patients to reconfirm acceptance at next login'
                />
              </div>
            </div>
        }
        <div className='row'>
          <div className='col-sm-6 col-lg-4'>
            <Button skinnyBtn submit form={form}>Save</Button>
          </div>
          {
            onDelete &&
              <div className='col-sm-6 col-lg-4'>
                <Button skinnyBtn secondary onClick={this.handleDelete}>Cancel</Button>
              </div>
          }
        </div>
      </form>
    )
  }
}

export default ConsentPolicyForm
