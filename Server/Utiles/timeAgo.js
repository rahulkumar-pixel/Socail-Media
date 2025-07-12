// timeAgo.js (Node.js compatible)
import TimeAgoLib from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgoLib.addDefaultLocale(en);
const timeAgo = new TimeAgoLib("en-US");

// Export a function that formats the date
export default function formatTimeAgo(date) {
  return timeAgo.format(new Date(date));
}
