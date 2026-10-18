import { useCallback, useEffect, useRef } from 'react'

/**
 * Plays the gallery's videos (galleryPhotos.js `video`) without ever
 * fetching one twice, and only when it is worth it.
 *
 * The ribbon draws every frame twice (the loop's copy), but each video
 * exists once: one <video>, made here, outside React, and moved into
 * whichever of its two frames shows more of itself inside the ribbon. The
 * other frame keeps the poster image beneath, so a frame never goes blank.
 *
 * - Nothing is made, and no video requested, until the section is within
 *   ~one screen of the viewport. The video is then made with
 *   preload="none"; its file is first requested when it is played.
 * - A video plays only while the section is on screen, its frame is inside
 *   the ribbon, and the gallery is not paused; otherwise it is paused.
 *   So videos that have drifted out of the ribbon do not play.
 * - Muted, inline, looping; if the browser refuses to autoplay, the poster
 *   simply stays.
 * - `off` (reduced motion): no video is ever made — the posters stand in.
 * - A video that fails to load (missing or empty file) is removed and not
 *   tried again; its frame keeps the photograph or placeholder beneath.
 *
 * Returns `host(id, copy)`: a ref callback for each frame's empty video
 * host (the same function every render, for a given frame).
 */
export function useGalleryVideos({ sectionRef, ribbonRef, videos, paused, off }) {
  // id → { config, hosts: [original, copy], ratios: [0, 0], video }
  const slots = useRef(new Map())
  const refs = useRef(new Map())
  const state = useRef({ near: false, onScreen: false, paused, off })

  const sync = useCallback(() => {
    const { near, onScreen, paused: isPaused, off: isOff } = state.current
    slots.current.forEach((slot) => {
      if (isOff || slot.failed) return
      const best = slot.ratios[1] > slot.ratios[0] ? 1 : 0
      const host = slot.hosts[best]
      const visible = slot.ratios[best] > 0

      if (!slot.video) {
        // Made the first time it is near the screen and inside the ribbon.
        if (!near || !visible || !host) return
        const video = document.createElement('video')
        video.muted = true
        video.defaultMuted = true
        video.loop = true
        video.playsInline = true
        video.preload = 'none'
        if (slot.config.poster) video.poster = slot.config.poster
        video.setAttribute('aria-hidden', 'true')
        video.tabIndex = -1
        // A file that is missing, empty or unplayable (e.g. a slot whose
        // video has not been added yet): drop the video for good, so the
        // frame keeps its photograph or placeholder.
        video.addEventListener('error', () => {
          slot.failed = true
          video.removeAttribute('src')
          video.remove()
          slot.video = null
        })
        video.src = slot.config.src
        slot.video = video
      }

      // Into the frame that shows more of it; moved in the same task, so
      // a playing video keeps playing.
      if (host && slot.video.parentNode !== host) host.appendChild(slot.video)

      if (onScreen && visible && !isPaused) {
        slot.video.play().catch(() => {
          // Autoplay refused (e.g. data saver): the poster stays.
        })
      } else if (!slot.video.paused) {
        slot.video.pause()
      }
    })
  }, [])

  // The section: near (start making videos) and on screen (let them play).
  useEffect(() => {
    const section = sectionRef.current
    if (!section || videos.length === 0) return undefined
    const near = new IntersectionObserver(
      ([entry]) => {
        state.current.near = entry.isIntersecting
        sync()
      },
      { rootMargin: '100% 0px' },
    )
    const onScreen = new IntersectionObserver(([entry]) => {
      state.current.onScreen = entry.isIntersecting
      sync()
    })
    near.observe(section)
    onScreen.observe(section)
    return () => {
      near.disconnect()
      onScreen.disconnect()
    }
  }, [sectionRef, videos.length, sync])

  // Each video frame, against the ribbon: how much of it is in view.
  useEffect(() => {
    const ribbon = ribbonRef.current
    if (!ribbon || videos.length === 0) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slot = slots.current.get(entry.target.dataset.videoId)
          if (slot) slot.ratios[Number(entry.target.dataset.videoCopy)] = entry.intersectionRatio
        })
        sync()
      },
      { root: ribbon, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    slots.current.forEach((slot) => slot.hosts.forEach((host) => host && observer.observe(host)))
    const all = slots.current
    return () => {
      observer.disconnect()
      all.forEach((slot) => {
        if (!slot.video) return
        slot.video.pause()
        slot.video.removeAttribute('src')
        slot.video.load()
        slot.video.remove()
        slot.video = null
      })
    }
  }, [ribbonRef, videos.length, sync])

  // The Pause button and reduced motion apply at once.
  useEffect(() => {
    state.current.paused = paused
    state.current.off = off
    sync()
  }, [paused, off, sync])

  const host = useCallback(
    (id, copy) => {
      const key = `${id}:${copy ? 1 : 0}`
      if (!refs.current.has(key)) {
        refs.current.set(key, (node) => {
          const config = videos.find((entry) => entry.id === id)?.video
          if (!config) return
          if (!slots.current.has(id)) {
            slots.current.set(id, { config, hosts: [null, null], ratios: [0, 0], video: null })
          }
          slots.current.get(id).hosts[copy ? 1 : 0] = node
        })
      }
      return refs.current.get(key)
    },
    [videos],
  )

  return host
}
