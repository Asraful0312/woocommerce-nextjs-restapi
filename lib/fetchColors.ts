export const fetchColors = async () => {
  const response = await fetch("/api/colors");
  const data = await response.json();
  return data.primary_color || null;
};
