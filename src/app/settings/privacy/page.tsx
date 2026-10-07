import { LegalPage } from "@/components/settings/legal-page";

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your privacy matters to us. This page explains how Poppi handles your information."
      sections={[
        {
          heading: "INFORMATION WE USE",
          content: (
            <>
              <LegalItem title="Profile information">
                Information you choose to add to your profile, such as your
                display name and avatar.
              </LegalItem>
              <LegalItem title="Movie activity">
                Movies you mark as watched, save to your watchlist or add to
                your favorites.
              </LegalItem>
              <LegalItem title="Movie preferences">
                Your selected genres and movie preferences are used to
                personalize recommendations.
              </LegalItem>
            </>
          ),
        },
        {
          heading: "HOW WE USE YOUR INFORMATION",
          content: (
            <div>
              <p>We use this information to:</p>
              <ul className="list-disc pl-4">
                <li>Personalize your movie recommendations</li>
                <li>Remember your watched and saved movies</li>
                <li>Improve your experience with Poppi</li>
              </ul>
            </div>
          ),
        },
        {
          heading: "YOUR DATA",
          content: (
            <>
              <p>
                You can update your profile and movie preferences at any time.
              </p>
              <p>
                This prototype does not connect to an account backend, so
                server-side account deletion is not currently available.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

function LegalItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1">{children}</p>
    </div>
  );
}

