// Next's Imports
import { notFound } from "next/navigation";

// App's Internal Imports
import { Genesis2TrackWinners } from "@/components/genesis2-winners";
import genesis2_tracks from "@/constants/genesis2-winners";

// The site is a static export, so every track page is built ahead of time
export const generateStaticParams = () => genesis2_tracks.map((track) => ({ track: track.slug }));
export const dynamicParams = false;

export const generateMetadata = async ({ params }) => {
  const { track: slug } = await params;
  const track = genesis2_tracks.find((t) => t.slug === slug);
  return { title: track ? `Genesis 2.0 ${track.name} Winners | QuestIT` : "Genesis 2.0 Winners | QuestIT" };
};

const Genesis2Track = async ({ params }) => {
  const { track: slug } = await params;
  if (!genesis2_tracks.some((t) => t.slug === slug)) notFound();
  return <Genesis2TrackWinners slug={slug} />;
};

export default Genesis2Track;
