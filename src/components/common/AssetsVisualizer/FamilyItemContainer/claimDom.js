const FIGURE_BASE = 'https://s3.us-west-1.amazonaws.com/static.patentrack.com/figures'

const mark = (classList) => {
  classList.add('claim-text')
  classList.add('patent-text')
}

/**
 * Decorates claim markup that arrives as raw HTML from the API: tags claim
 * bodies, marks dependent claims, and rewrites figure <img> tags to the CDN.
 *
 * Extracted from ClaimData so it can be read and tested on its own; it has no
 * component state and never had any.
 */
export default function decorateClaimTree(node) {
  if (node === null) return

  let claims = node.querySelectorAll('div[num]')
  if (claims.length === 0) claims = node.querySelectorAll('div[id*="CLM-"]')
  claims.forEach((claim) => {
    mark(claim.classList)
    const texts = claim.querySelectorAll('div')
    texts.forEach((text, index) => { if (index > 0) mark(text.classList) })
  })

  let refs = node.querySelectorAll('span[idref]')
  let isTap = false
  if (refs.length === 0) {
    refs = node.querySelectorAll('dependent-claim-reference')
    isTap = true
  }
  refs.forEach((child) => {
    if (isTap) child.classList.add('margin-l-r')
    const parent = child.closest('div[num]') || child.closest('div[id*="CLM-"]')
    if (parent === null) return
    mark(parent.classList)
    parent.parentElement.classList.add('claim-dependent')
  })

  node.querySelectorAll('img').forEach((img) => {
    img.setAttribute('height', img.getAttribute('he'))
    img.setAttribute('width', img.getAttribute('wi'))
    img.setAttribute('src', `${FIGURE_BASE}/${img.getAttribute('file').replace('TIF', 'png')}`)
  })
}
