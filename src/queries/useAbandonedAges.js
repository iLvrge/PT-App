import useAbandonedAssets from './useAbandonedAssets'

/** Column chart of abandonment by asset age. */
export default function useAbandonedAges(params) {
  return useAbandonedAssets('getAllAbandonedAssetsAges', params)
}
