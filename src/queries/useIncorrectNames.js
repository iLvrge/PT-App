import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/**
 * Incorrect company names for the selected companies, returned both raw and as
 * the word-cloud shape the chart consumes. The transform used to run inside the
 * effect, via a map used for its side effect and an await over the array of
 * undefined it produced.
 */
export default function useIncorrectNames({ selectedCompanies = [], selectedCompaniesAll } = {}) {
  const companies = selectedCompaniesAll === true ? [] : selectedCompanies
  const enabled = selectedCompaniesAll === true || selectedCompanies.length > 0

  return useQuery({
    queryKey: [ 'incorrectNames', companies, selectedCompaniesAll === true ],
    enabled,
    queryFn: async () => {
      const { data } = await PatenTrackApi.getIncorrectNames(companies)
      const rows = Array.isArray(data) ? data : []
      return {
        rawData: rows,
        namesData: rows.map((item) => ({
          text: item.name,
          value: 40 + (item.distance * 2),
        })),
      }
    },
  })
}
