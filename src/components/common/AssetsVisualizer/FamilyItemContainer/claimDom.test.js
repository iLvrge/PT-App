import { describe, it, expect } from 'vitest'
import decorateClaimTree from './claimDom'

const mount = (html) => {
  const node = document.createElement('div')
  node.innerHTML = html
  return node
}

describe('decorateClaimTree', () => {
  it('does nothing when handed null', () => {
    expect(() => decorateClaimTree(null)).not.toThrow()
  })

  it('marks claim bodies identified by a num attribute', () => {
    const node = mount('<div num="1"><div>first</div><div>second</div></div>')
    decorateClaimTree(node)
    const claim = node.querySelector('div[num]')
    expect(claim.classList.contains('claim-text')).toBe(true)
    expect(claim.classList.contains('patent-text')).toBe(true)
  })

  it('leaves the first inner div unmarked, marking only subsequent ones', () => {
    const node = mount('<div num="1"><div id="a">a</div><div id="b">b</div></div>')
    decorateClaimTree(node)
    expect(node.querySelector('#a').classList.contains('claim-text')).toBe(false)
    expect(node.querySelector('#b').classList.contains('claim-text')).toBe(true)
  })

  it('falls back to CLM- ids when no num attribute is present', () => {
    const node = mount('<div id="CLM-00001"><div>x</div></div>')
    decorateClaimTree(node)
    expect(node.querySelector('#CLM-00001').classList.contains('claim-text')).toBe(true)
  })

  it('marks the parent of a dependent-claim reference', () => {
    const node = mount('<div num="2"><span idref="CLM-1">ref</span></div>')
    decorateClaimTree(node)
    expect(node.querySelector('div[num]').classList.contains('claim-text')).toBe(true)
    expect(node.classList.contains('claim-dependent')).toBe(true)
  })

  it('adds margin-l-r only for the tap-style reference element', () => {
    const node = mount('<div num="2"><dependent-claim-reference>r</dependent-claim-reference></div>')
    decorateClaimTree(node)
    expect(node.querySelector('dependent-claim-reference').classList.contains('margin-l-r')).toBe(true)
  })

  it('rewrites figure images to the CDN, converting TIF to png', () => {
    const node = mount('<img he="100" wi="200" file="US1234-D00001.TIF" />')
    decorateClaimTree(node)
    const img = node.querySelector('img')
    expect(img.getAttribute('height')).toBe('100')
    expect(img.getAttribute('width')).toBe('200')
    expect(img.getAttribute('src')).toBe(
      'https://s3.us-west-1.amazonaws.com/static.patentrack.com/figures/US1234-D00001.png'
    )
  })
})
