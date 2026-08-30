import useCompanyLookup from './useCompanyLookup'

/** Lenders for the currently selected companies. */
export default function useLendersByCompany(selectedCompanies) {
  return useCompanyLookup('getLendersByCompany', selectedCompanies)
}
