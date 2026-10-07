import { LegalPage } from "@/components/settings/legal-page";

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms explain the basic rules for using Poppi."
      sections={[
        {
          heading: "USING POPPI",
          content: (
            <p>
              Poppi is designed to help you discover, organize and keep track
              of movies. You agree to use the service responsibly and not
              attempt to misuse or interfere with the app.
            </p>
          ),
        },
        {
          heading: "MOVIE INFORMATION",
          content: (
            <p>
              Movie information, posters, ratings and availability may come
              from third-party services. We do our best to provide useful
              information, but we cannot guarantee that all movie information
              is always complete or up to date.
            </p>
          ),
        },
        {
          heading: "RECOMMENDATIONS",
          content: (
            <p>
              Poppi&apos;s recommendations are suggestions based on your
              preferences and interactions with the app. Recommendations are
              provided for discovery purposes and may not always match your
              expectations.
            </p>
          ),
        },
        {
          heading: "THIRD-PARTY SERVICES",
          content: (
            <p>
              Poppi may provide links or information about third-party
              streaming services. Their own terms and policies apply when you
              use those services.
            </p>
          ),
        },
        {
          heading: "CHANGES TO POPPI",
          content: <p>Features and content may change as Poppi evolves.</p>,
        },
        {
          heading: "CONTACT",
          content: <p>Questions about these terms?</p>,
        },
      ]}
    />
  );
}
