import express from 'express';
import { Webhook } from 'svix';
import Stripe from 'stripe';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { inngest } from '../inngest/client.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk Webhook Event handler
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    return res.status(500).json({ success: false, message: 'Missing CLERK_WEBHOOK_SECRET' });
  }

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ success: false, message: 'Error: Missing Svix headers' });
  }

  const payload = req.body;
  const wh = new Webhook(SIGNING_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error: Could not verify webhook:', err.message);
    return res.status(400).json({ success: false, message: 'Webhook verification failed' });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const email = evt.data.email_addresses[0].email_address;
      const firstName = evt.data.first_name;
      const lastName = evt.data.last_name;
      const imageUrl = evt.data.image_url;

      await User.findOneAndUpdate(
        { clerkId: id },
        { email, firstName, lastName, imageUrl },
        { upsert: true, new: true }
      );
    } else if (eventType === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: id });
    }

    res.status(200).json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Stripe Webhook Event handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const booking = await Booking.findById(session.metadata.bookingId);
      if (booking && booking.status === 'pending') {
        booking.status = 'paid';
        await booking.save();

        // Trigger email notification via Inngest
        try {
          await inngest.send({
            name: 'booking/payment.success',
            data: { bookingId: booking._id.toString() }
          });
        } catch (e) {
          console.error('Error triggering payment.success event', e);
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  }

  res.json({ received: true });
});

export default router;
