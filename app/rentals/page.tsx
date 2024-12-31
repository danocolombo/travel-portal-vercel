import EmptyList from '@/components/home/EmptyList';
import { fetchRentals, deleteRentalAction } from '@/utils/actions';
import Link from 'next/link';

import { formatCurrency } from '@/utils/format';
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

async function RentalsPage() {
    // this returns only the rentals for the authUser, not all rentals in db
    const rentals = await fetchRentals();

    if (rentals.length === 0) {
        return (
            <EmptyList
                heading='No rentals to display.'
                message="Don't hesitate to create a rental."
            />
        );
    }
    // if we get rentals, we render the table with data
    return (
        <div className='mt-16'>
            <h4 className='mb-4 capitalize'>
                Active Properties : {rentals.length}
            </h4>
            <Table>
                <TableCaption>A list of all your properties.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property Name</TableHead>
                        <TableHead>Nightly Rate </TableHead>
                        <TableHead>Nights Booked</TableHead>
                        <TableHead>Total Income</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rentals.map((rental) => {
                        // this creates alias for rental.id as propertyId and other values
                        const { id: propertyId, name, price } = rental;
                        const { totalNightsSum, orderTotalSum } = rental;
                        return (
                            <TableRow key={propertyId}>
                                <TableCell>
                                    <Link
                                        href={`/properties/${propertyId}`}
                                        className='underline text-muted-foreground tracking-wide'
                                    >
                                        {name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatCurrency(price)}</TableCell>
                                <TableCell>{totalNightsSum || 0}</TableCell>
                                <TableCell>
                                    {formatCurrency(orderTotalSum)}
                                </TableCell>

                                <TableCell className='flex items-center gap-x-2'>
                                    <Link href={`/rentals/${propertyId}/edit`}>
                                        <IconButton actionType='edit'></IconButton>
                                    </Link>
                                    <DeleteRental propertyId={propertyId} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function DeleteRental({ propertyId }: { propertyId: string }) {
    const deleteRental = deleteRentalAction.bind(null, { propertyId });
    return (
        <FormContainer action={deleteRental}>
            <IconButton actionType='delete' />
        </FormContainer>
    );
}

export default RentalsPage;
