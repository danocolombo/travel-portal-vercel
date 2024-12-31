import { fetchChartsData } from '@/utils/actions';
import Chart from './Chart';

async function ChartsContainer() {
    const bookings = await fetchChartsData();
    console.log('bookings\n:', bookings);
    if (bookings.length < 1) return null;

    return <Chart data={bookings} />;
}
export default ChartsContainer;
