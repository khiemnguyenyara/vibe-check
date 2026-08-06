"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { dictionaries, type Dictionary } from "./dictionaries";
import { readStoredLocale, writeStoredLocale } from "./storage";
import type { Locale } from "./types";

const DEFAULT_LOCALE: Locale = "vi";

interface LocaleContextValue {
  readonly locale: Locale;
  readonly t: Dictionary;
  readonly setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Renders `DEFAULT_LOCALE` on the server and first paint, then swaps to the
 * stored preference in an effect — same reasoning as `useGuestState`: the
 * server has no localStorage, so reading it during render would desync
 * hydration. A returning non-default-locale visitor sees one brief flash
 * before the swap; that's the accepted cost of a client-only preference.
 */
export function LocaleProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: dictionaries[locale],
      setLocale: (next) => {
        setLocaleState(next);
        writeStoredLocale(next);
      },
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
