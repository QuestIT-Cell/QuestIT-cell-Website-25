// Genesis 2.0 winners, grouped by track
// Each winning team has one team photo in /images/genesis2_winners/<track>/
// Photos fill the whole screen, so landscape photos with faces in the upper half work best
// Placeholder values (TBA) are to be replaced once the results are out
// Each track card uses its EVA number, colour and character from the Genesis 2.0 poster

const PLACEHOLDER_PHOTO = "/images/Genesis2.0banner.webp";

const placeholder_team = (place) => ({
  place,
  team: "Team TBA",
  members: ["Member 1", "Member 2", "Member 3", "Member 4"],
  project: "Project name TBA",
  photo: PLACEHOLDER_PHOTO,
});

const genesis2_tracks = [
  {
    slug: "launchpad",
    name: "Launchpad",
    eva: "01",
    color: "#4f8bff",
    character: "/images/genesis2_tracks/shinji.webp",
    tagline: "Track description TBA",
    winners: [
      placeholder_team("1st Place"),
      placeholder_team("2nd Place"),
      placeholder_team("3rd Place"),
      placeholder_team("4th Place"),
    ],
  },
  {
    slug: "core-system",
    name: "Core Systems",
    eva: "02",
    color: "#ff4d4d",
    character: "/images/genesis2_tracks/asuka.webp",
    tagline: "Track description TBA",
    winners: [
      placeholder_team("1st Place"),
      placeholder_team("2nd Place"),
      placeholder_team("3rd Place"),
    ],
  },
  {
    slug: "ascension",
    name: "Ascension",
    eva: "03",
    color: "#c9ccd6",
    character: "/images/genesis2_tracks/kaworu.webp",
    tagline: "Track description TBA",
    winners: [
      placeholder_team("1st Place"),
      placeholder_team("2nd Place"),
      placeholder_team("3rd Place"),
    ],
  },
];

export const PLACE_STYLES = {
  "1st Place": "from-yellow-400 to-amber-600",
  "2nd Place": "from-gray-300 to-gray-500",
  "3rd Place": "from-orange-400 to-amber-700",
  "4th Place": "from-orange-600 to-red-700",
};

export default genesis2_tracks;
