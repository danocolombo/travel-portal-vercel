import EmptyList from '@/components/home/EmptyList';
import CountryFlagAndName from '@/components/card/CountryFlagAndName';
import Link from 'next/link';

import { formatDate, formatCurrency, formatQuantity } from '@/utils/format';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';
import { fetchBookings, deleteBookingAction } from '@/utils/actions';

async function BookingsPage() {
    // the fetchBookings function is an async function that fetches the bookings
    // for the getAuthUser, not all the bookings in the database.
    const bookings = await fetchBookings();
    if (bookings.length === 0) {
        return <EmptyList />;
    }
    return (
        <div className='mt-16'>
            <h4 className='mb-4 capitalize'>
                total bookings : {bookings.length}
            </h4>
            <Table>
                <TableCaption>{`A list of your upcoming ${formatQuantity(
                    bookings.length,
                    'booking'
                )}.`}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Nights</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bookings.map((booking) => {
                        const {
                            id,
                            orderTotal,
                            totalNights,
                            checkIn,
                            checkOut,
                        } = booking;
                        // this destructuring also renames the id to propertyId, as
                        // to not confuse it with the booking id above.
                        const {
                            id: propertyId,
                            name,
                            country,
                        } = booking.property;
                        // checkIn and checkOut are renamed to startDate and endDate
                        const startDate = formatDate(checkIn);
                        const endDate = formatDate(checkOut);
                        // now return each row with the values
                        return (
                            <TableRow key={id}>
                                <TableCell>
                                    <Link
                                        href={`/properties/${propertyId}`}
                                        className='underline text-muted-foreground tracking-wide'
                                    >
                                        {name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <CountryFlagAndName countryCode={country} />
                                </TableCell>
                                <TableCell>{totalNights}</TableCell>
                                <TableCell>
                                    {formatCurrency(orderTotal)}
                                </TableCell>
                                <TableCell>{startDate}</TableCell>
                                <TableCell>{endDate}</TableCell>
                                <TableCell>
                                    <DeleteBooking bookingId={id} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function DeleteBooking({ bookingId }: { bookingId: string }) {
    const deleteBooking = deleteBookingAction.bind(null, { bookingId });
    return (
        <FormContainer action={deleteBooking}>
            <IconButton actionType='delete' />
        </FormContainer>
    );
}

export default BookingsPage;
