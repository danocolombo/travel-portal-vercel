'use client';

import { useProperty } from '@/utils/store';
import ConfirmBooking from './ConfirmBooking';
import BookingForm from './BookingForm';
function BookingContainer() {
    const { range } = useProperty((state) => state);
    const state = useProperty((state) => state);
    console.log('BC:9-->state:\n', state);
    // invalid range, return null (don't display booking form)
    if (!range || !range.from || !range.to) return null;
    // if we don't have a valid range, return null (don't display booking form)
    if (range.to.getTime() === range.from.getTime()) return null;

    return (
        <div className='w-full'>
            <BookingForm />
            <ConfirmBooking />
        </div>
    );
}

export default BookingContainer;
