"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, Settings, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function GlassVideoWebsite() {
  const [showVideoControls, setShowVideoControls] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [canPlay, setCanPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      console.log("[v0] Video loaded data")
      setCanPlay(true)
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      console.log("[v0] Video load started")
      setIsLoading(true)
    }

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setVideoProgress(progress)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    // Preload video
    video.preload = "auto"

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  useEffect(() => {
    if (!showVideoControls) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        skipVideo(-10)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        skipVideo(10)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showVideoControls])

  const toggleVideoControls = () => {
    setShowVideoControls(!showVideoControls)
  }

  const seekVideo = (value: number[]) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = (value[0] / 100) * video.duration
    }
  }

  const skipVideo = (seconds: number) => {
    const video = videoRef.current
    if (video) {
      video.currentTime += seconds
    }
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2" style={{ top: "-15rem" }}>
            <div className="flex gap-2 justify-center">
              <span className="text-3xl animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1.5s" }}>
                ❤️
              </span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1.8s" }}>
                💖
              </span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: "600ms", animationDuration: "1.2s" }}>
                ❤️
              </span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: "900ms", animationDuration: "1.6s" }}>
                💕
              </span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: "1200ms", animationDuration: "1.4s" }}>
                ❤️
              </span>
            </div>
          </div>
          <img
            src="https://i.pinimg.com/736x/77/f5/14/77f514daeb0beb8560c2716c011d1cf2.jpg"
            alt="Loading"
            className="h-screen object-contain"
          />
        </div>
      )}

      {/* Full-screen video background */}
      <video ref={videoRef} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" preload="auto">
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Navigation Bar - Only show icon */}
      {!showVideoControls && (
        <nav className="relative z-10 p-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="glass text-white hover:bg-white/20">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      )}

      {/* Spotify Embed - Bottom Left */}
      <div
        className={`fixed bottom-6 left-6 w-80 glass-strong rounded-xl border border-white/20 overflow-hidden transition-transform duration-300 ${
          showVideoControls ? "-translate-x-96" : "translate-x-0"
        }`}
      >
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/5luSWFEWR6iPi3zranCVMt?utm_source=generator&theme=0"
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* Video Controls Toggle - Bottom Right */}
      <Button
        onClick={toggleVideoControls}
        className="fixed bottom-6 right-6 glass-strong text-white hover:bg-white/20 border-white/20 z-30"
        size="icon"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {showVideoControls && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 glass-strong text-white border-white/20 rounded-lg p-6 min-w-96">
            <div className="space-y-4">
              {/* Video Progress */}
              <div className="space-y-2">
                <Slider value={[videoProgress]} max={100} step={0.1} onValueChange={seekVideo} className="w-full" />
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* -10s round icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipVideo(-10)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                {/* Back */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipVideo(-5)}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                {/* Play/Pause */}
                <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipVideo(5)}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                {/* +10s round icon rotated */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipVideo(10)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
