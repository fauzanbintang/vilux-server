export const LedgerConst = {
  LegitCheckService: 'Legit Check Service',
  PaymentGatewayFee: 'Payment Gateway Fee',
  Order: 'orders',
  Margin: 'vilux margin',
  Voucher: 'Voucher Discount',
  ViluxMargin: 'Vilux Margin',
} as const;

export const NotificationConst = {
  SuccessVerifyEmail: {
    title: 'Welcome to Vilux',
    body: "Start verifying your luxury items now, quick and easy. We're here to ensure you only have the real deal. Let's get started!",
  },
  PendingPaymentUser: {
    title: 'Your have pending payment [order_id] from Vilux',
    body: 'Pending Payment Alert! You have 60 mins to complete your payment, complete payment now to continue with your legit check',
  },
  SuccessPaymentUser: {
    title: 'Thank you for submitting your item',
    body: "Your item has been successfully submitted. We'll begin the legit check process and notify you once it's completed. Stay tuned!",
  },
  SuccessPaymentAdmin: {
    title: 'Pending Order Alert - [user_role]',
    body: 'You have a new legit-check request for Order [order_id]. Time to review and process!',
  },
  RejectedDataValidation: {
    title: 'We cannot process your item',
    body: 'We encountered an issue with your submitted data and cannot process your item. Please review your submission and response to our notes.',
  },
  RevisedData: {
    title: 'Order [order_id] - User Responsed',
    body: 'You have rejected data to response',
  },
  ApprovedDataValidation: {
    title: 'Your Item is Now Being Checked!',
    body: "We've started the legit check process for your item. Sit tight, and we'll update you with the results soon!",
  },
  DoneLegitCheck: {
    title: 'Your item has been completely checked',
    body: "We've finished check your items, please preview your certificate result on apps. Thank you for using our service!",
  },
  UnidentifiedLegitCheck: {
    title: 'Sorry we fail to check your item',
    body: "We couldn't complete your item check. Don't worry, we've sent you a refund voucher for your next check. Check your app for details!",
  },
};
