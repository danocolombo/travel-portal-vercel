import { calculateDaysBetween } from '@/utils/calendar';

type BookingDetails = {
    checkIn: Date;
    checkOut: Date;
    price: number;
};
export function calculateTotals({ checkIn, checkOut, price }: BookingDetails) {
    const nights = calculateDaysBetween({
        checkIn,
        checkOut,
    });
    const subTotal = nights * price;
    const cleaningFee = 50;
    const serviceFee = 30;
    const tax = subTotal * 0.1;
    const reservationTotal = subTotal + cleaningFee + serviceFee + tax;
    return {
        nights,
        subTotal,
        cleaningFee,
        serviceFee,
        tax,
        reservationTotal,
    };
}
