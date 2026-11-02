// Genesis 2.0 winners, grouped by track
// Each winning team has one team photo in /images/genesis2_winners/<track>/
// Photos fill the whole screen, so landscape photos with faces in the upper half work best
// Placeholder values (TBA) are to be replaced once the results are out

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
    name: "Core System",
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
