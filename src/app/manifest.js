export const dynamic = "force-static";
const manifest = () => {
  return {
    id: "/",
    start_url: "/",
    name: "QuestIT",
    orientation: "any",
    short_name: "QuestIT",
    display: "standalone",
    theme_color: "#00FAFF",
    background_color: "#0A0F1B",
    description:
      "A platform for students of VESIT to Learn, Compete & Have Fun through various Technical and Non-technical Events.",
    icons: [
      {
        sizes: "192x192",
        type: "image/png",
        src: "/images/icon-192x192.png",
      },
      {
        sizes: "512x512",
        type: "image/png",
        src: "/images/icon-512x512.png",
      },
    ],
    screenshots: [
      {
        label: "Home",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/home.png",
      },
      {
        label: "About",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/about.png",
      },
      {
        label: "Events",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/events.png",
      },
      {
        label: "Team",
        type: "image/png",
        sizes: "1179x2556",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/team.png",
      },
      {
        type: "image/png",
        sizes: "1179x2556",
        label: "Developers",
        form_factor: "narrow",
        src: "/images/screenshots/mobile/developers.png",
      },
      {
        label: "Home",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/home.png",
      },
      {
        label: "About",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/about.png",
      },
      {
        label: "Events",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/events.png",
      },
      {
        label: "Team",
        type: "image/png",
        sizes: "1292x727",
        form_factor: "wide",
        src: "/images/screenshots/desktop/team.png",
      },
      {
        type: "image/png",
        sizes: "1292x727",
        label: "Developers",
        form_factor: "wide",
        src: "/images/screenshots/desktop/developers.png",
      },
    ],
  };
};

export default manifest;
