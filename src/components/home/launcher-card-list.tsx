import { launcherCardListStyles } from "./launcher-card-list.styles";

/** Grid container for `LauncherCard`s on the home launcher. */
export function LauncherCardList({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className={launcherCardListStyles.grid}>{children}</div>;
}
