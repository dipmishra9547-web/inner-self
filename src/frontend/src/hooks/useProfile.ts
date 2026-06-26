import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { AnimalType } from "../types/animals";
import type { SevenSinsResultEntry } from "../types/auth";

export type SavedProfile = {
  archetype: AnimalType;
  takenAt: bigint;
};

export function useMyProfile() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SavedProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      // Backend not yet fully typed — gracefully handle
      try {
        const actorRecord = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        const result = await actorRecord.getMyProfile?.();
        if (!result) return null;
        // Result is Option<UserProfile>
        const opt = result as {
          __kind__: string;
          value?: { archetype: { __kind__: string }; takenAt: bigint };
        };
        if (opt.__kind__ === "None") return null;
        if (opt.__kind__ === "Some" && opt.value) {
          return {
            archetype: opt.value.archetype.__kind__ as AnimalType,
            takenAt: opt.value.takenAt,
          };
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<void, Error, AnimalType>({
    mutationFn: async (archetype: AnimalType) => {
      if (!actor) throw new Error("Not connected");
      try {
        const actorRecord = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        await actorRecord.saveMyProfile?.({ __kind__: archetype });
      } catch (err) {
        throw new Error(String(err));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
export function useMySevenSinsResults(token: string | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<SevenSinsResultEntry[]>({
    queryKey: ["mySevenSinsResults", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      try {
        const actorRecord = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        const result = await actorRecord.getMySevenSinsResults?.(token);
        if (!result) return [];
        const r = result as {
          __kind__: string;
          ok?: SevenSinsResultEntry[];
          err?: string;
        };
        if (r.__kind__ === "err") return [];
        return (r.ok ?? []) as SevenSinsResultEntry[];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!token,
    staleTime: 1000 * 60 * 2,
  });
}
