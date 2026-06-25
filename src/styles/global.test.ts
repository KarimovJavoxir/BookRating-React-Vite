/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8')

function getRuleBody(selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rules = Array.from(css.matchAll(new RegExp(`^${escapedSelector}\\s*{(?<body>[\\s\\S]*?)^}`, 'gm')))
  const rule = rules.at(-1)

  return rule?.groups?.body ?? ''
}

describe('global layout styles', () => {
  test('keeps the book details rating section in the desktop row layout', () => {
    const ratingSectionRule = getRuleBody('.rating-section')

    expect(ratingSectionRule).not.toContain('flex-direction: column')
    expect(ratingSectionRule).not.toContain('justify-content: flex-start')
  })

  test('centers numbers inside rating option buttons', () => {
    const ratingOptionRule = getRuleBody('.rating-option')

    expect(ratingOptionRule).toContain('display: inline-grid')
    expect(ratingOptionRule).toContain('place-items: center')
  })
})
