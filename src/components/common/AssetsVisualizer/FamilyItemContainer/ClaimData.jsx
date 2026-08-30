import React from 'react'
import { Typography } from '@mui/material'
import './styles.css'
import Loader from '../../Loader'
import useClaimsData from '../../../../queries/useClaimsData'
import { parseSupplied, isAbsent } from '../../../../queries/parseSupplied'
import decorateClaimTree from './claimDom'

/** Was declared inside ClaimData, so React remounted the whole tree each render. */
const ClaimTree = ({ items, className }) => (
  <div className={className} ref={decorateClaimTree}>
    <ul id={`claimsTree`} className={`filetree treeview`} width='100%'>
      {items.map((child, index) => (
        <li key={`asset-type-${index}`}>
          <span id={`claim${index}`}>
            <Typography
              variant='body2'
              style={{ whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{
                __html: Object.keys(child).length > 0 && child.text !== undefined ? child.text : child,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  </div>
)

/** Same guarded/unguarded effect pair as its three siblings; only the guard is kept. */
const ClaimData = ({ data, number }) => {

  const supplied = parseSupplied(data)
  const useSupplied = !isAbsent(supplied)

  const { data: fetched, isFetching } = useClaimsData(number, { enabled: !useSupplied })
  const claims = useSupplied ? supplied : (fetched ?? '')

  if (isFetching) return <Loader />
  if (Array.isArray(claims)) return <ClaimTree items={claims} className={'pt-filetree'} />
  return <div dangerouslySetInnerHTML={{ __html: claims }} className={'pt-filetree'} />
}

export default ClaimData
