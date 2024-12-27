import EmptyList from '@/components/home/EmptyList';
import PropertiesList from '@/components/home/PropertiesList';
import { fetchFavorites } from '@/utils/actions';

async function FavoritesPage() {
    const favorites = await fetchFavorites();

    if (favorites.length === 0) {
        return <EmptyList />;
    }

    return (
        <div>
            <header className='flex justify-between items-center mt-4'>
                <h1 className='text-4xl font-bold capitalize'>Favorites</h1>
            </header>
            <PropertiesList properties={favorites} />
        </div>
    );
}
export default FavoritesPage;
