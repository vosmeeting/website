import queryString from 'query-string';
import Stripe from 'stripe';
import { Attendee, Vendor } from '../domain/Vendor';
import { appConfig } from '../domain/config/appConfig';

export interface Item {
  amount: number; // Assuming amount is a number for simplicity
}

export class StripeInteractor {
  private WEBHOOK_SECRET = appConfig.keys.stripeWebhookSecret;
  private SECRET_KEY = appConfig.keys.stripeSecretKey;

  private stripe = new Stripe(this.SECRET_KEY, { apiVersion: '2020-08-27' });

  async createVendorCheckoutSessions(item: Item, vendor: Vendor, redirectURL: string) {
    const cents = item.amount * 100;

    const transformedItem = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Application for Commercial Exhibits and Sponsorship',
          description: '5th Veterinary Ophthalmic Surgery Meeting Jul 19-22, 2024',
          images: [`${redirectURL}/vosm_logo.png`]
        },
        unit_amount: cents
      },
      quantity: 1
    };

    const customer = await this.stripe.customers.create({
      email: vendor.email,
      name: vendor.companyName,
      phone: vendor.companyTelephone
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [transformedItem],
      mode: 'payment',
      success_url: `${redirectURL}/payment-success`,
      cancel_url: queryString.stringifyUrl({
        url: `${redirectURL}/vendor`,
        query: {
          ...vendor,
          ...item,
          error: 'payment was cancelled'
        }
      }),
      customer: customer.id
    });

    return session;
  }
  async createParticipantCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    expInSeconds: number,
    successUrl: string,
    cancelUrl: string,
    dbCustId: string,
    reservationId: string,
    secretUrlId?: string
  ) {
    const checkoutSession = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      expires_at: expInSeconds, // expires in one hour
      mode: 'payment',
      success_url: queryString.stringifyUrl({
        url: successUrl,
        query: {
          from: '/register'
        }
      }),
      cancel_url: queryString.stringifyUrl({
        url: cancelUrl,
        query: secretUrlId
          ? {
              error: 'payment was cancelled',
              secretUrlId
            }
          : {
              error: 'payment was cancelled'
            }
      }),
      customer: dbCustId,
      metadata: {
        reservationId
      }
    });
    return checkoutSession;
  }
  createCustomer = (cust: Attendee) => {
    return this.stripe.customers.create(cust);
  };
  retrivePaymentIntents = (paymentIntentId: string) =>
    this.stripe.paymentIntents.retrieve(paymentIntentId);
  retriveCheckoutSessions = (sessionId: string) =>
    this.stripe.checkout.sessions.retrieve(sessionId);
  constructEvent = (buf: Buffer | string, sig: string | string[]) =>
    this.stripe.webhooks.constructEvent(buf, sig, this.WEBHOOK_SECRET);
}

export const stripeInteractor = new StripeInteractor();
