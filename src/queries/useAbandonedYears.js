import useAbandonedAssets from './useAbandonedAssets'

/** Column chart of abandonment by year. */
export default function useAbandonedYears(params) {
  return useAbandonedAssets('getAllAbandonedAssetsYears', params)
}
