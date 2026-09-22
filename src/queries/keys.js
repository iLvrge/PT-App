/**
 * Query keys, in one place so a mutation can invalidate precisely rather than
 * guessing at a string another file wrote.
 */
/** Ids normalised so the same selection made in another order still hits. */
const ids = (list) => (Array.isArray(list) ? [ ...list ].map(String).sort() : [])

export const queryKeys = {
  abstract: (number) => [ 'abstract', number ],
  figures: (number) => [ 'figures', number ],
  specification: (number) => [ 'specification', number ],
  claims: (number) => [ 'claims', number ],

  /**
   * The asset grid.
   *
   * Every argument the request varies by has to appear here. Leave one out and
   * two different selections share a cache entry, which shows one portfolio's
   * assets under another's name - a far worse bug than a slow request. Paging
   * and sort are part of the response, so they are part of the key.
   */
  layoutAssets: ({
    type, companies, tabs, customers, rfIDs,
    startIndex, endIndex, column, direction, salesAssets, lawyers,
  }) => [
    'layoutAssets',
    type,
    ids(companies), ids(tabs), ids(customers), ids(rfIDs),
    startIndex, endIndex, column, direction,
    salesAssets === true, ids(lawyers),
  ],
}

/** Prefix for every asset-grid entry, to drop the whole set at once. */
queryKeys.layoutAssetsRoot = () => [ 'layoutAssets' ]

export default queryKeys
