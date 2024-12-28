import { calculateTotals } from '@/utils/calculateTotals';
import { Card, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProperty } from '@/utils/store';
import { formatQuantity } from '@/utils/format';
import { formatCurrency } from '@/utils/format';
import { format } from 'path';
function BookingForm() {
    const { range, price } = useProperty((state) => state);
    const checkIn = range?.from as Date;
    const checkOut = range?.to as Date;
    const { nights, subTotal, cleaningFee, serviceFee, tax, reservationTotal } =
        calculateTotals({
            checkIn,
            checkOut,
            price,
        });
    const identifier = nights > 1 ? 'nights' : 'night';
    return (
        <Card className='p-4 mb-4'>
            <CardTitle className='mb-4'>Summary </CardTitle>
            <FormRow
                label={`$${price} x ${formatQuantity(nights, 'night')}`}
                amount={subTotal}
            />
            <FormRow label='Cleaning Fee' amount={cleaningFee} />
            <FormRow label='Service Fee' amount={serviceFee} />
            <FormRow label='Tax' amount={tax} />
            <Separator className='mt-2' />
            <CardTitle className='mt-4'>
                <FormRow label='Booking Total' amount={reservationTotal} />
            </CardTitle>
        </Card>
    );
}

function FormRow({ label, amount }: { label: string; amount: number }) {
    return (
        <p className='flex justify-between text-sm mb-2'>
            <span>{label}</span>
            <span>{formatCurrency(amount)}</span>
        </p>
    );
}

export default BookingForm;
