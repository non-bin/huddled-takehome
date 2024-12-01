import { get } from 'svelte/store';
import type { PageServerLoad } from './$types';

/**
 * @param timestamp In milliseconds
 * @returns Floored hour in 0-23 format
 */
function getHour(timestamp: number, timezone: string) {
  const date = new Date(timestamp);
  return +date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  });
}

// Honolulu is UTC-10 and never has daylight saving time so it's a good test case
// const TEST_TIMESTAMP = 1651407117477;
// if (
//   ((TEST_TIMESTAMP / 1000 / 60 / 60) % 24) - 10 !==
//   getHour(TEST_TIMESTAMP, 'Pacific/Honolulu')
// ) {
//   throw new Error('getHour is not working correctly');
// }

export const load: PageServerLoad = async ({ locals }) => {
  const db = locals.db;

  const ENGAGEMENT_VALUES: { [event: string]: number } = {
    play_track: 0.2, // People play tracks all the time so it's not that valuable
    pause_track: -0.1, // They didn't like it, or they were interrupted
    like_track: 1, // I think this is a good baseline since you can only like a song once
    add_track_to_playlist: 1, // Similar to liking
    share_track: 2, // Valuable, but not putting this so high as it's also likely to bring more engagement
    share_artist: 4, // Even better that sharing a track, but as above it's likely to bring more engagement
    follow_artist: 5, // Very good, and can't be repeated
    unfollow_artist: -5, // Very bad
    hover_section: 0,
    scroll_page: 0,
    hover_artist_name: 0
  };
  const ENGAGEMENT_TYPES = Object.keys(ENGAGEMENT_VALUES);

  // Get all events
  const eventsQuery = `
SELECT
    e.artist_id AS artist_id,
    e.event_type AS event_type,
    e.created_at AS timestamp,
    u.timezone AS timezone
FROM
    user_events e
JOIN
    users u ON e.user_id = u.id
`;
  const eventsData: {
    artist_id: number;
    event_type: string;
    timestamp: number;
    timezone: string;
  }[] = await db.prepare(eventsQuery).all();

  // Get all artists
  const artistsQuery = `SELECT id, name FROM artists`;
  const artistsData: { id: number; name: string }[] = await db
    .prepare(artistsQuery)
    .all();

  // Setup data structure for artists and their scores
  const data: {
    artistName: string;
    scoresByHour: number[];
    selected: boolean;
  }[] = [];
  for (let artistIndex = 0; artistIndex < artistsData.length; artistIndex++) {
    const artist = artistsData[artistIndex];
    data[artist.id] = {
      artistName: artist.name,
      scoresByHour: new Array(24).fill(0),
      selected: false
    };
  }

  // Calculate scores for each artist
  for (let eventIndex = 0; eventIndex < eventsData.length; eventIndex++) {
    const event = eventsData[eventIndex];
    if (!ENGAGEMENT_TYPES.includes(event.event_type)) {
      continue;
    }
    const eventScore = ENGAGEMENT_VALUES[event.event_type];

    data[event.artist_id].scoresByHour[
      getHour(event.timestamp, event.timezone)
    ] += eventScore;
  }

  // Clean up rounding errors
  for (let artistID = 0; artistID < data.length; artistID++) {
    const artist = data[artistID];
    if (
      typeof artist === 'undefined' ||
      !Object.hasOwn(artist, 'scoresByHour')
    ) {
      continue;
    }

    for (let hour = 0; hour < artist.scoresByHour.length; hour++) {
      artist.scoresByHour[hour] = +artist.scoresByHour[hour].toFixed(1);
    }
  }

  // Preselect the first valid artist
  for (let artistID = 0; artistID < data.length; artistID++) {
    const artist = data[artistID];
    if (typeof artist !== 'undefined') {
      artist.selected = true;
      break;
    }
  }

  return {
    data
  };
};
