/**
 * Query keys, in one place so a mutation can invalidate precisely rather than
 * guessing at a string another file wrote.
 */
export const queryKeys = {
  abstract: (number) => [ 'abstract', number ],
  figures: (number) => [ 'figures', number ],
  specification: (number) => [ 'specification', number ],
  claims: (number) => [ 'claims', number ],
}

export default queryKeys
