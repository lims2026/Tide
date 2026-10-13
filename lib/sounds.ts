const soundCache = new Map<string, HTMLAudioElement>()

/** Play an interface sound without allowing autoplay or missing-file errors to escape. */
export function playSound(src: string) {
  if (typeof window === 'undefined') return

  let audio = soundCache.get(src)
  if (!audio) {
    audio = new Audio(src)
    audio.preload = 'auto'
    soundCache.set(src, audio)
  }

  audio.currentTime = 0
  void audio.play().catch(() => undefined)
}

export const playClickSound = () => playSound('/audio/click.mp3')
export const playPoemSound = () => playSound('/audio/splashpoem.mp3')
export const playExcitedSound = () => playSound('/audio/splashexcited.mp3')
export const playTooEarlySound = () => playSound('/audio/tooearly.mp3')
export const playSurpriseSound = () => playSound('/audio/surprise.mp3')
