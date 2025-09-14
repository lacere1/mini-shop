import { Body, Controller, Post } from '@nestjs/common';
import Stripe from 'stripe';

type IntentDTO = { amount_cents: number; currency: string };

@Controller('payments')
export class PaymentsController {
  private stripe: Stripe | null;
  private mode: 'auto' | 'client';

  constructor() {
    const key = process.env.STRIPE_SECRET || '';
    this.stripe = key ? new Stripe(key) : null;
    this.mode = (process.env.STRIPE_MODE as 'auto' | 'client') || 'auto';
  }

  @Post('intents')
  async createIntent(@Body() dto: IntentDTO) {
    const amount = Math.max(0, Math.trunc(dto.amount_cents || 0));
    const currency = (dto.currency || 'GBP').toLowerCase();

    // the initial mock (no Stripe key provided)
    if (!this.stripe) {
      return { id: `pi_demo_${Date.now()}`, status: 'succeeded', provider: 'mock' };
    }

    // the stripe mode
    if (this.mode === 'auto') {
      // one-call demo: confirm using a Stripe test payment method 
      const pi = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: 'pm_card_visa', // this is my tripe test method
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });
      return { id: pi.id, status: pi.status, provider: 'stripe' };
    } else {
      // client mode: return client_secret for Stripe Elements on the frontend
      const pi = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });
      return {
        id: pi.id,
        client_secret: pi.client_secret,
        status: pi.status,
        provider: 'stripe',
      };
    }
  }
}
