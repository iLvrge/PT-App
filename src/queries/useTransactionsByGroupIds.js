import { useQuery } from '@tanstack/react-query'
import PatenTrackApi from '../api/patenTrack2'

/** Transactions for a set of assignment group ids. */
export default function useTransactionsByGroupIds(groupIds = []) {
  return useQuery({
    queryKey: [ 'transactionsByGroupIds', groupIds ],
    enabled: groupIds.length > 0,
    queryFn: async () => {
      const form = new FormData()
      form.append('group_ids', JSON.stringify(groupIds))
      const { data } = await PatenTrackApi.getTransactionByRfIds(form)
      return data?.list ?? []
    },
  })
}
