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
        photo: "/images/genesis2_winners/syntax-squad-track01-PS01.webp",
      },
      {
        place: "Problem Statement 2 Winner",
        team: "Kaizen",
        members: ["Parth Khot", "Saket Chaudhari", "Yug Bonde"],
        photo: "/images/genesis2_winners/kaizen-track01-PS02.webp",
      },
      {
        place: "Problem Statement 3 Winner",
        team: "Scanning Void",
        members: ["Gaurang Malekar", "Indraneel Kolas", "Sunkia Prasad", "Arnav Shettigar"],
        photo: "/images/genesis2_winners/scanning-void-track01-PS03.webp",
      },
      {
        place: "Problem Statement 4 Winner",
        team: "Infinite Loop",
        members: ["Trisha Choudhary", "Neel Daswani", "Vidisha Athalye", "Janhavi Rangire"],
        photo: "/images/genesis2_winners/infinite-loop-track01-PS04.webp",
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
        photo: "/images/genesis2_winners/code-yatri-track02-winners.webp",
      },
      {
        place: "First Runner-Up",
        team: "Karna",
        members: ["Rugved Vichare", "Shreyash Singh", "Saman Pandey", "Soham Raorane"],
        photo: "/images/genesis2_winners/karna-track02-runnerups.webp",
      },
      {
        place: "Second Runner-Up",
        team: "Code Yodha",
        members: ["Alina Khan", "Tanay Patil", "Twinkle Gupta", "Harshal Pednekar"],
        photo: "/images/genesis2_winners/Code-yodha-track02-2ndrunnerups.webp",
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
        photo: "/images/genesis2_winners/gossip-girls-track03-winner.webp",
      },
      {
        place: "First Runner-Up",
        team: "Techno Titans",
        members: ["Siddharth Jagdale", "Sahil Nirmal", "Madhavan Nadar", "Rishi Dembla"],
        photo: "/images/genesis2_winners/techno-titans-track03-runnerups.webp",
      },
      {
        place: "Second Runner-Up",
        team: "Smurfs",
        members: ["Afnan Kazi", "Arnav Choudhari", "Rutuja Bhalekar", "Siddharth Gupta"],
        photo: "/images/genesis2_winners/Smurfs-track03-2nd-runnerups.webp",
      },
    ],
  },
];

export default genesis2_tracks;
