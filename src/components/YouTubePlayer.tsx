"use client";

import { useState } from "react";

// A clean, in-site lesson player. Shows a branded thumbnail with a play
// button and only loads the YouTube iframe on click (faster, fewer trackers
// before the student actually watches).
export function YouTubePlayer({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) {
    return (
      <div className="card flex aspect-video w-full items-center justify-center bg-surface text-sm text-muted">
        Lesson video coming soon.
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-navy">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`Play lesson: ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-coral text-white shadow-lg transition-transform group-hover:scale-110">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
