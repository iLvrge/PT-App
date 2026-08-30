import useCompanyLookup from './useCompanyLookup'

/** Customer addresses for the selected companies, once an address is chosen. */
export default function useCustomerAddresses(selectedCompanies, { enabled } = {}) {
  return useCompanyLookup('getCustomerAddressByCompanyIDs', selectedCompanies, { enabled })
}
