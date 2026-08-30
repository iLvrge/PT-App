import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'
import { numberWithCommas, applicationFormat } from '../utils/numbers'

/**
 * Family members for one asset, with the display formatting the table expects.
 *
 * The formatting used to mutate the response array in place inside the effect;
 * it is done here so the component receives data it can render directly.
 */
export default function useAssetFamily(asset) {
  return useQuery({
    queryKey: [ 'assetFamily', asset ],
    enabled: !!asset,
    queryFn: async () => {
      const { data } = await PatenTrackApi.assetFamily(asset)
      if (!Array.isArray(data)) return []
      return data.map((element) => ({
        ...element,
        patent_number: element.patent_number !== null
          ? `${element.publication_country} ${numberWithCommas(element.patent_number)}`
          : '',
        application_number: element.application_number !== null
          ? `${element.publication_country} ${applicationFormat(element.application_number)}`
          : '',
      }))
    },
  })
}
