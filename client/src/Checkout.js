import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import Log from './log';

import config from './config';
const STRIPE_PUBLISHABLE = config.stipe.publishable;
const PAYMENT_SERVER_URL = config.endpoints.payment;


const CURRENCY = 'USD';

const fromUSDToCent = amount => amount * 100;

const onToken = (amount, description) => token =>
  axios.post(PAYMENT_SERVER_URL,
    {
      description: description,
      stripeToken: token.id,
      currency: CURRENCY,
      amount: fromUSDToCent(amount),
      email: token.email
    })
    .then( response => {
      Log('Response:', response);
    })
    .catch(error => {
      Log('Error:', error);
    })

const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
    name={name}
    description={description}
    amount={fromUSDToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />

export default Checkout;