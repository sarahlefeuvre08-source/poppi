import type { ReactNode } from "react";

import { AppExperience } from "@/components/layout/app-experience";
import { MovieLibraryProvider } from "@/components/providers/movie-library-provider";
import { MovieNavigationProvider } from "@/components/providers/movie-navigation-provider";
import { MovieSearchProvider } from "@/components/providers/movie-search-provider";
import { PoppiConversationProvider } from "@/components/providers/poppi-conversation-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SettingsProvider>
      <MovieLibraryProvider>
        <MovieNavigationProvider>
          <MovieSearchProvider>
            <PoppiConversationProvider>
              <AppExperience>{children}</AppExperience>
            </PoppiConversationProvider>
          </MovieSearchProvider>
        </MovieNavigationProvider>
      </MovieLibraryProvider>
    </SettingsProvider>
  );
}
