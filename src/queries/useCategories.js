import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/** The category list is global and rarely changes, so it is cached longer. */
export function useCategories() {
  return useQuery({
    queryKey: [ 'categories' ],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getCategories()
      return data ?? []
    },
  })
}

/** Products within one category. */
export function useProductsByCategory(category) {
  return useQuery({
    queryKey: [ 'productsByCategory', category ],
    enabled: category > 0,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getProductsByCategory(category)
      return data ?? []
    },
  })
}
