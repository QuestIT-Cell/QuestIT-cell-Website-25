export const dynamic = "force-static";
const robots = () => {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
};

export default robots;
