import type { QuestNodeState } from "@/components/quest/quest-node";
import type { DomainConfig, Specialty } from "@/lib/domains";
import type {
  CurrentTrack,
  ProgressIndex,
  SpecialtyProgress,
} from "@/lib/session/progress";

export interface GuestState {
  readonly count: number;
  readonly progress: ProgressIndex;
  readonly track: CurrentTrack | null;
  readonly loaded: boolean;
}

export const EMPTY_GUEST: GuestState = {
  count: 0,
  progress: new Map(),
  track: null,
  loaded: false,
};

export interface ResolvedNode {
  readonly domain: DomainConfig;
  readonly specialty: Specialty;
  readonly state: QuestNodeState;
  readonly record?: SpecialtyProgress;
  readonly lockedReason?: string;
}
