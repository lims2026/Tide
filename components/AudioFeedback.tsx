'use client'

import { useEffect } from 'react'
import { playClickSound } from '@/lib/sounds'

/** Delegates one click effect for ordinary buttons, links, and button-like controls. */
export function AudioFeedback() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const control = event.target.closest<HTMLElement>('button, a, [role="button"]')
      if (!control || control.dataset.sfx === 'custom') return
      playClickSound()
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
