// Genesis 2.0 winners, grouped by track
// Each winning team has one team photo in /images/genesis2_winners/<track>/
// Photos fill a large frame with the team name over the bottom, so landscape photos with faces in the upper half work best
// The first member of each team is its team leader
// PLACEHOLDER_PHOTO and the TBA taglines are to be replaced once the team photos and track details are in
// Each track card uses its EVA number, colour and character from the Genesis 2.0 poster

const PLACEHOLDER_PHOTO = "/images/Genesis2.0banner.webp";

const genesis2_tracks = [
  {
    slug: "launchpad",
    name: "Launchpad",
    eva: "01",
    color: "#4f8bff",
    character: "/images/genesis2_tracks/shinji.webp",
    tagline: "Track description TBA",
    winners: [
      {
        place: "Problem Statement 1 Winner",
        team: "Syntax Squad",
        members: ["Bhargav Chougule", "Shrishant Kharat", "Nayan Kulal", "Anshal Nikhade"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "Problem Statement 2 Winner",
        team: "Kaizen",
        members: ["Parth Khot", "Saket Chaudhari", "Yug Bonde"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "Problem Statement 3 Winner",
        team: "Scanning Void",
        members: ["Gaurang Malekar", "Indraneel Kolas", "Sunkia Prasad", "Arnav Shettigar"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "Problem Statement 4 Winner",
        team: "Infinite Loop",
        members: ["Trisha Choudhary", "Neel Daswani", "Vidisha Athalye", "Janhavi Rangire"],
        photo: PLACEHOLDER_PHOTO,
      },
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
      {
        place: "Winner",
        team: "Code Yatri",
        members: ["Adarsh Singh", "Piyush Shukla", "Mayuresh Sarkale", "Vidushi Singh"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "First Runner-Up",
        team: "Karna",
        members: ["Rugved Vichare", "Shreyash Singh", "Saman Pandey", "Soham Raorane"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "Second Runner-Up",
        team: "Code Yodha",
        members: ["Alina Khan", "Tanay Patil", "Twinkle Gupta", "Harshal Pednekar"],
        photo: PLACEHOLDER_PHOTO,
      },
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
      {
        place: "Winner",
        team: "Gossip Gurls :)",
        members: ["Rishi Mahajan", "Supriya Kushwaha", "Krutika Wagh", "Roshni Aga"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "First Runner-Up",
        team: "Techno Titans",
        members: ["Siddharth Jagdale", "Sahil Nirmal", "Madhavan Nadar", "Rishi Dembla"],
        photo: PLACEHOLDER_PHOTO,
      },
      {
        place: "Second Runner-Up",
        team: "Smurfs",
        members: ["Afnan Kazi", "Arnav Choudhari", "Rutuja Bhalekar", "Siddharth Gupta"],
        photo: PLACEHOLDER_PHOTO,
      },
    ],
  },
];

export default genesis2_tracks;
