import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from 'next/navigation';

import { NextResponse, type NextRequest } from 'next/server';
import db from '@/utils/db';
//*****************************************************************
//* This route is used to confirm the payment status of a booking
//* It is called by the Stripe webhook when a payment is successful
//*****************************************************************
// this is the GET prepared for the payment/route.ts request
// ${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}
export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    //* get the session_id from the query string
    const session_id = searchParams.get('session_id') as string;

    try {
        //* get the session details from Stripe to check the status
        const session = await stripe.checkout.sessions.retrieve(session_id);
        // this gets the posted bookingId we sent and we check with the
        // the bookingId in the url.
        const bookingId = session.metadata?.bookingId;
        if (session.status !== 'complete' || !bookingId) {
            throw new Error('Something went wrong');
        }
        //* update the booking payment status in the database
        //* could possibly also save tracking info of the payment.
        await db.booking.update({
            where: { id: bookingId },
            data: { paymentStatus: true },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
    redirect('/bookings');
};
