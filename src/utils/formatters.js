/**
 * Safely format an ISO date string or YYYY-MM-DD date into human-readable format.
 * Avoids timezone off-by-one errors caused by UTC midnight conversions.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "N/A";

  try {
    // If format is YYYY-MM-DD, parse year, month, day explicitly
    if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const parts = dateStr.split("T")[0].split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Extracts clean uppercase initials for client avatars.
 */
export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
