import { BillingAddressPayload, InvoicesPayload, PagePayload, PaymentInfoPayload, SubscriptionPayload, UpdateBillingAddressPayload, UpdatePaymentInfoPayload, UpdateSubscriptionPayload } from './types'

import { BillingInfoEntity } from '#/api'
import { defineAction } from 'redoodle'

// Actions
export const GetInvoices = defineAction('[subscription] get invoices')<PagePayload>()
export const GetInvoicesSuccess = defineAction('[subscription] get invoices success')<InvoicesPayload>()
export const GetInvoicesError = defineAction('[subscription] get invoices error')()

export const GetBillingInfo = defineAction('[subscription] get billing info')()
export const GetBillingInfoSuccess = defineAction('[subscription] get billing info success')<BillingInfoEntity>()
export const GetBillingInfoError = defineAction('[subscription] get billing info error')()

export const UpdatePaymentInfo = defineAction('[subscription] update payment info')<UpdatePaymentInfoPayload>()
export const UpdatePaymentInfoSuccess = defineAction('[subscription] update payment info success')<PaymentInfoPayload>()
export const UpdatePaymentInfoError = defineAction('[subscription] update payment info error')()

export const UpdateBillingAddress = defineAction('[subscription] update billing address')<UpdateBillingAddressPayload>()
export const UpdateBillingAddressSuccess = defineAction('[subscription] update billing address success')<BillingAddressPayload>()
export const UpdateBillingAddressError = defineAction('[subscription] update billing address error')()

export const UpdateSubscription = defineAction('[subscription] update subscription')<UpdateSubscriptionPayload>()
export const UpdateSubscriptionSuccess = defineAction('[subscription] update subscription success')<SubscriptionPayload>()
export const UpdateSubscriptionError = defineAction('[subscription] update subscription error')()
