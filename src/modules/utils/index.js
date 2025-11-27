// Returns the current year
const fetch_current_year = () => {
  const date = new Date();
  return date.getFullYear();
};

export { fetch_current_year };
