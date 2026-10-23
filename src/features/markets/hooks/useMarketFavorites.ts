import { useMemo } from 'react';

import { useLocalStorageState } from '@shared/hooks';

const STORAGE_KEY = 'nexora-favorite-markets';

export function useMarketFavorites() {
  const [favoritePairs, setFavoritePairs] = useLocalStorageState<string[]>(STORAGE_KEY, []);
  const favorites = useMemo(() => new Set(favoritePairs), [favoritePairs]);

  const toggleFavorite = (pair: string) => {
    setFavoritePairs((current) =>
      current.includes(pair) ? current.filter((item) => item !== pair) : [...current, pair]
    );
  };

  return { favorites, isFavorite: (pair: string) => favorites.has(pair), toggleFavorite };
}
