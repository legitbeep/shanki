"use client";

import { useState, useRef, useEffect, JSX } from "react";
import {
  Menu,
  Settings,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  Heart,
} from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Meteors } from "@/components/magicui/meteors";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { TextAnimate } from "@/components/magicui/text-animate";
import { AuroraText } from "@/components/magicui/aurora-text";
import { Confetti } from "@/components/magicui/confetti";
import { CoolMode } from "@/components/magicui/cool-mode";

// Types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "default" | "icon";
  variant?: "default" | "ghost";
}

interface SliderProps {
  value: number[];
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

// Custom Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  size = "default",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes: Record<string, string> = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Slider Component
const Slider: React.FC<SliderProps> = ({
  value,
  max,
  step,
  onValueChange,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <input
      type="range"
      min="0"
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
      style={{
        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${value[0]}%, rgba(255,255,255,0.3) ${value[0]}%, rgba(255,255,255,0.3) 100%)`,
      }}
    />
  );
};

export default function GlassVideoWebsite(): JSX.Element {
  const [showVideoControls, setShowVideoControls] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);
  const [showProceedButton, setShowProceedButton] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spotifyRef = useRef<HTMLIFrameElement>(null);
  const confettiRef = useRef<any>(null);

  // Calculate days since April 17th (assuming current year)
  const calculateDaysSince = (): number => {
    const startDate = new Date(2025, 3, 17); // April 17, 2024 (month is 0-indexed)
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysSince: number = calculateDaysSince();

  useEffect(() => {
    // Show text animation after 1 second
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // Show proceed button after 3 seconds
    const buttonTimer = setTimeout(() => {
      setShowProceedButton(true);
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isLoading) {
        e.preventDefault();
        proceedToSite();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isLoading]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log("[v0] Video loaded data");
      setCanPlay(true);
    };

    const updateProgress = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        setVideoProgress(progress);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Handle iOS fullscreen events
    const handleEnterFullscreen = () => {
      console.log("Video entered fullscreen");
    };

    const handleExitFullscreen = () => {
      console.log("Video exited fullscreen");
      // Ensure video continues playing after exiting fullscreen on iOS
      setTimeout(() => {
        if (video.paused && !isLoading) {
          video.play().catch(console.log);
        }
      }, 100);
    };

    // Handle visibility change (when user switches tabs or minimizes browser)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, but don't pause the video
        console.log("Page hidden, keeping video playing");
      } else {
        // Page is visible again, ensure video is playing
        console.log("Page visible, ensuring video plays");
        if (video.paused && !isLoading) {
          video.play().catch(console.log);
        }
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("webkitbeginfullscreen", handleEnterFullscreen);
    video.addEventListener("webkitendfullscreen", handleExitFullscreen);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Preload video
    video.preload = "auto";

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("webkitbeginfullscreen", handleEnterFullscreen);
      video.removeEventListener("webkitendfullscreen", handleExitFullscreen);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!showVideoControls) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        skipVideo(-10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skipVideo(10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showVideoControls]);

  const autoplaySpotify = (): void => {
    setTimeout(() => {
      try {
        // Try to find the play button in the Spotify iframe
        const iframe = spotifyRef.current;
        if (iframe && iframe.contentDocument) {
          const playButton =
            iframe.contentDocument.querySelector('[title="Play"]') ||
            iframe.contentDocument.querySelector(
              '[data-testid="play-button"]'
            ) ||
            iframe.contentDocument.querySelector('button[aria-label*="Play"]');

          if (playButton && playButton instanceof HTMLElement) {
            console.log("Found play button, clicking...", playButton);
            playButton.click();
          } else {
            console.log("Play button not found in iframe");
          }
        }
      } catch (error) {
        console.log("Cannot access iframe content due to CORS policy");
        // Fallback: try to send message to iframe
        try {
          if (spotifyRef.current && spotifyRef.current.contentWindow) {
            spotifyRef.current.contentWindow.postMessage(
              { command: "play" },
              "*"
            );
          }
        } catch (msgError) {
          console.log("Message posting also failed");
        }
      }
    }, 1000);
  };

  const autoplayVideo = (): void => {
    const video = videoRef.current;
    if (video) {
      // Ensure video properties are set for iOS
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;

      video.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  };

  const proceedToSite = (): void => {
    console.log("Proceeding to site...");
    setIsLoading(false);
    setCanPlay(true);

    // Auto-play video after a short delay
    setTimeout(() => {
      autoplayVideo();
    }, 500);

    // Auto-play Spotify
    autoplaySpotify();
  };

  const toggleVideoControls = (): void => {
    setShowVideoControls(!showVideoControls);
  };

  const seekVideo = (value: number[]): void => {
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = (value[0] / 100) * video.duration;
    }
  };

  const skipVideo = (seconds: number): void => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += seconds;
    }
  };

  const togglePlayPause = (): void => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-40 size-full"
        /> */}
        {isLoading && (
          <>
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
              <Meteors number={30} className="z-10 inset-0" />
              {/* Centered text container */}
              <div className="absolute w-[500px] max-w-[80dvw] text-center z-30">
                <div
                  className="transition-all duration-1000 ease-out"
                  style={{
                    opacity: showText ? 1 : 0,
                    transform: showText ? "translateY(0)" : "translateY(32px)",
                  }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
                    ShAnki's Love Gallery
                  </h1>
                  <div
                    className="flex items-center justify-center gap-2 text-2xl text-white/90 transition-all duration-1000"
                    style={{
                      opacity: showText ? 1 : 0,
                      transform: showText
                        ? "translateY(0)"
                        : "translateY(32px)",
                      transitionDelay: "500ms",
                    }}
                  >
                    <Heart
                      fill="red"
                      className="h-5 w-5 text-red-400 animate-pulse"
                    />
                    <span>
                      <NumberTicker
                        value={daysSince}
                        className="whitespace-pre-wrap tracking-tighter text-white"
                      />{" "}
                      days journey
                    </span>
                    <Heart
                      fill="red"
                      className="h-5 w-5 text-red-400 animate-pulse"
                    />
                  </div>
                </div>
              </div>

              {/* Background image */}
              <img
                src="/img/us2.png"
                alt="Loading"
                className="h-screen w-screen object-cover opacity-60 z-20"
              />

              {/* Proceed button */}
              {showProceedButton && (
                <div className="absolute z-60 bottom-8 left-1/2 transform -translate-x-1/2 ">
                  <button
                    onClick={proceedToSite}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-white transition-all duration-300 ease-out border border-white/30 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 active:scale-95"
                  >
                    <span className="relative flex items-center gap-2">
                      Enter Gallery
                      <div className="w-0 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 group-hover:w-6 transition-all duration-300"></div>
                    </span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Full-screen video background */}
        <video
          ref={videoRef}
          autoPlay={!isLoading}
          loop
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="absolute inset-0 w-full h-full object-cover"
          preload="auto"
          style={{
            pointerEvents: showVideoControls ? "auto" : "none",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src="/video/shanki.mp4" type="video/mp4" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute top-0 inset-0 bg-black/20" />

        {/* Navigation Bar - Only show icon */}
        {!showVideoControls && (
          <nav className="relative z-50 p-2 cursor-pointer">
            <CoolMode>
              <Button variant="ghost" className="hover:bg-transparent">
                <SparklesText
                  sparklesCount={2}
                  className="font-black text-white text-xl cursor-pointer"
                >
                  SHANKI ❤️
                </SparklesText>
              </Button>
            </CoolMode>
          </nav>
        )}
        {/* Spotify Embed - Always loaded but positioned based on state */}
        <div
          className={`fixed bottom-2 w-80 glass-strong rounded-xl border border-white/20 overflow-hidden transition-all duration-500 z-10 ${
            isLoading
              ? "left-[-400px]" // Hidden off-screen when loading
              : showVideoControls
              ? "left-[-400px]" // Hidden off-screen when video controls are open
              : "left-2" // Normal position
          }`}
        >
          <iframe
            ref={spotifyRef}
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
          className="fixed bottom-2 right-2 glass-strong text-white hover:bg-white/20 border-white/20 z-30"
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
                  <Slider
                    value={[videoProgress]}
                    max={100}
                    step={0.1}
                    onValueChange={seekVideo}
                    className="w-full"
                  />
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
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
    </>
  );
}
