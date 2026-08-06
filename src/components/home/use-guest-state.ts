"use client";

import { useEffect, useState } from "react";

import { buildProgressIndex, currentTrack } from "@/lib/session/progress";
import { loadHistory, readInterviewCount } from "@/lib/session/storage";

import { EMPTY_GUEST, type GuestState } from "./types";

/**
 * Storage is read in an effect, never during render: the server has no
 * localStorage, so a render-time read desyncs hydration and flashes the
 * wrong node states. `loaded` keeps the first paint neutral.
 */
export function useGuestState(): GuestState {
  const [state, setState] = useState<GuestState>(EMPTY_GUEST);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const history = loadHistory();
    setState({
      count: readInterviewCount(),
      progress: buildProgressIndex(history),
      track: currentTrack(history),
      loaded: true,
    });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return state;
}
