import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/**
 * Law firm names for the word cloud.
 *
 * Note this calls getLawFirmsByCompany with a second argument, unlike
 * useLawFirmsByCompany which passes only the company list - the same endpoint
 * serving two different callers.
 *
 * Rows without a distance get a random size. That used to be recomputed every
 * time the effect ran, so the cloud resized itself on unrelated re-fetches;
 * computing it in the query function means one size per result.
 */
export default function useLawFirmNames({
  selectedCompanies = [],
  selectedCompaniesAll,
  selectedLawFirm,
  randomSize,
} = {}) {
  const companies = selectedCompaniesAll === true ? [] : selectedCompanies
  const enabled = selectedCompaniesAll === true || selectedCompanies.length > 0

  return useQuery({
    queryKey: [ 'lawFirmNames', companies, selectedCompaniesAll === true, selectedLawFirm ],
    enabled,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getLawFirmsByCompany(companies, selectedLawFirm)
      const rows = Array.isArray(data) ? data : []
      return {
        rawData: rows,
        namesData: rows.map((item) => ({
          text: item.lawfirm,
          value: typeof item.distance !== 'undefined' ? item.distance : randomSize(),
        })),
      }
    },
  })
}
