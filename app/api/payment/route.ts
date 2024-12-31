import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest, type NextResponse } from 'next/server';
import db from '@/utils/db';
import { formatDate } from '@/utils/format';

//********************************************************************************
// This API route is responsible for creating a Stripe Checkout Session. It allows
// us to do simple calls on the front-end (use client) and then create complex
// detailed requests on the back-end (use server).
// client-side call: axios.post('/api/payment', { bookingId: bookingId });
// NOTE: body has to be an object with a bookingId property.
//* ------------------------------------------------------------------------------
//* TEST CARD INFO:
//* 4242 4242 4242 4242 - 12/34- 123 (rest of the fields can be anything)
//********************************************************************************

export const POST = async (req: NextRequest, res: NextResponse) => {
    const requestHeaders = new Headers(req.headers);
    //********************************************************************************
    // the origin header is used to validate the request origin and will allow this
    // API to be called only from the origin of the request. Which is localhost:3000
    // in development and the deployed URL in production.
    //********************************************************************************
    const origin = requestHeaders.get('origin');
    //* get the bookingId from the request body
    const { bookingId } = await req.json();
    //*-------------------------------------------------
    //* get the booking details from the database
    //* in this query we get ALL the booking info and
    //* the property name and image
    //*-------------------------------------------------
    const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
            property: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
    if (!booking) {
        return Response.json(null, {
            status: 404,
            statusText: 'Not Found',
        });
    }
    //*****************************************************
    //* NOTE we get the variables deconstructed from booking
    //* but note that property.image becomes image and property.name
    //* becomes name. Realize this could be a conflict if we had
    //* a name or image property in the booking object.
    //*****************************************************
    const {
        totalNights,
        orderTotal,
        checkIn,
        checkOut,
        property: { image, name },
    } = booking;

    try {
        //* note this is the information we are sending to Stripe
        //* to be displayed during the checkout process.
        //* NOTE: image is an array, even if we only have 1.
        //* We are sending the price in cents, so we multiply by 100.
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            metadata: { bookingId: booking.id },
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${name}`,
                            images: [image],
                            description: `Stay in this wonderful place for ${totalNights} nights, from ${formatDate(
                                checkIn
                            )} to ${formatDate(checkOut)}. Enjoy your stay!`,
                        },
                        unit_amount: orderTotal * 100,
                    },
                },
            ],
            mode: 'payment',
            return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
        });
        //* above is our own API in response to Stripe. The CHECKOUT_SESSION_ID
        //* is a placeholder that Stripe will replace with the actual session ID.
        return Response.json({ clientSecret: session.client_secret });
    } catch (error) {
        console.log(error);
        return Response.json(null, {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
};
