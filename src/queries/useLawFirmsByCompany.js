import useCompanyLookup from './useCompanyLookup'

/** Law firms for the currently selected companies. */
export default function useLawFirmsByCompany(selectedCompanies) {
  return useCompanyLookup('getLawFirmsByCompany', selectedCompanies)
}
