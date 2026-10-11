'use client'

import { useSyncExternalStore } from 'react'

/** Demo trip time starts at 13:42 local trip time and advances in real time. */
const DEMO_START_MINUTES = 13 * 60 + 42

let mountedAt: number | null = null

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000)
  return () => window.clearInterval(id)
}

function getSnapshot() {
  const nowSeconds = Math.floor(Date.now() / 1000)
  if (mountedAt === null) mountedAt = nowSeconds
  return DEMO_START_MINUTES + (nowSeconds - mountedAt) / 60
}

function getServerSnapshot() {
  return DEMO_START_MINUTES
}

export function useTripClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
