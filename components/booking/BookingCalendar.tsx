'use client';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { useProperty } from '@/utils/store';

import {
    generateDisabledDates,
    generateDateRange,
    defaultSelected,
    generateBlockedPeriods,
} from '@/utils/calendar';

function BookingCalendar() {
    const currentDate = new Date();
    const { toast } = useToast();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
    // need to block out any dates that are already booked
    const bookings = useProperty((state) => state.bookings);
    // need to convert the dates into usable data for the calendar
    const blockedDays = generateBlockedPeriods({
        bookings,
        today: currentDate,
    });
    const unavailableDates = generateDisabledDates(blockedDays);

    useEffect(() => {
        // check if the selected range is available
        const selectedRange = generateDateRange(range);
        // check if any of the range dates are in the unavailable dates
        const isDisabledDateIncluded = selectedRange.some((date) => {
            if (unavailableDates[date]) {
                setRange(defaultSelected); // reset the range

                toast({ description: 'Some dates are not available' });
                return true;
            }
        });

        useProperty.setState({ range });
    }, [range]);

    return (
        <Calendar
            mode='range'
            defaultMonth={currentDate}
            selected={range}
            onSelect={setRange}
            className='mb-4'
            disabled={blockedDays}
        />
    );
}
export default BookingCalendar;
