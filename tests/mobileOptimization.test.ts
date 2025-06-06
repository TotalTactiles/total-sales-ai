import { describe, it, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { optimizeForMobile } from '../src/utils/mobileOptimization'

let dom: JSDOM

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body></body></html>')
  ;(global as any).window = dom.window as any
  ;(global as any).document = dom.window.document as any
})

describe('optimizeForMobile', () => {
  it('does not modify existing viewport content', () => {
    const meta = dom.window.document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    optimizeForMobile()
    expect(meta.getAttribute('content')).toBe('width=device-width, initial-scale=1.0')
  })
})
