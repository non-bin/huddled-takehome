import { Database, Statement } from "bun:sqlite"; // You can use this if you prefer Bun

// import Database from "better-sqlite3";
// import { Statement } from "better-sqlite3";

// -----------------------------------------------------------------------------
// Database schema/Types
// -----------------------------------------------------------------------------

interface User {
  username: string;
  timezone: string;
}

interface UserSession {
  user_id: number;
  created_at: number;
  active: number;
}

interface Artist {
  name: string;
}

interface Track {
  title: string;
  artist_id: number;
}

interface Visit {
  artist_id: number;
  session_id: number;
  start_time: number;
  end_time: number;
}

interface UserEvent {
  user_id: number;
  artist_id: number;
  event_type: string;
  event_target: string | null;
  created_at: number;
}

// -----------------------------------------------------------------------------
// Utility functions
// -----------------------------------------------------------------------------

const db: Database = new Database("./main.db");

function getTimestamp(): number {
  // Date range of data: 01/05/2022 to 01/06/2022
  const startDate: number = new Date("2022-05-01T00:00:00Z").getTime();
  const endDate: number = new Date("2022-06-01T23:59:59Z").getTime();
  return Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;
}

function getRandomUserInteraction(tracks: { id: number }[]): {
  eventType: string;
  eventTarget: string | null;
} {
  // Define possible interactions with weights
  const events: { eventType: string; weight: number; targets?: string[] }[] = [
    {
      eventType: "play_track",
      weight: 20,
      targets: tracks.map((track) => track.id.toString()),
    },
    {
      eventType: "share_track",
      weight: 12,
      targets: tracks.map((track) => track.id.toString()),
    },
    { eventType: "pause_track", weight: 10 },
    {
      eventType: "add_track_to_playlist",
      weight: 10,
      targets: tracks.map((track) => track.id.toString()),
    },
    {
      eventType: "like_track",
      weight: 10,
      targets: tracks.map((track) => track.id.toString()),
    },
    { eventType: "scroll_page", weight: 30 },
    { eventType: "hover_artist_name", weight: 5 },
    { eventType: "follow_artist", weight: 5 },
    { eventType: "unfollow_artist", weight: 2 },
    { eventType: "share_artist", weight: 3 },
    {
      eventType: "hover_section",
      weight: 5,
      targets: ["Popular Tracks", "Albums", "Related Artists"],
    },
  ];

  // Calculate total weight
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);

  // Generate a random number between 0 and total weight
  const random = Math.random() * totalWeight;

  // Find the event that matches the random number
  let cumulativeWeight = 0;
  for (const event of events) {
    cumulativeWeight += event.weight;
    if (random <= cumulativeWeight) {
      // If the event has possible targets, pick one at random
      const target = event.targets
        ? event.targets[Math.floor(Math.random() * event.targets.length)]
        : null;
      return {
        eventType: event.eventType,
        eventTarget: target,
      };
    }
  }

  // Fallback (shouldn't happen)
  return { eventType: "unknown_event", eventTarget: null };
}

// -----------------------------------------------------------------------------
// Seeding functions
// -----------------------------------------------------------------------------

function seedUsers(amount: number): void {
  const availableTimezones = [
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Africa/Johannesburg",
  ];

  // Drop and recreate the users table
  db.exec(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE "users" (
      "id" INTEGER,
      "username" TEXT NOT NULL UNIQUE,
      "timezone" TEXT NOT NULL,
      PRIMARY KEY ("id" AUTOINCREMENT)
    );
  `);

  // Seed the users table
  const users: User[] = Array.from({ length: amount }, (_, i) => ({
    username: `User ${i + 1}`,
    timezone:
      availableTimezones[Math.floor(Math.random() * availableTimezones.length)],
  }));
  const query: Statement = db.prepare(
    "INSERT INTO users (username, timezone) VALUES ($username, $timezone)"
  );
  users.forEach((user: User) => query.run(user.username, user.timezone));

  console.log("Users table seeded successfully.");
}

function seedUserSessions(amount: number): void {
  // Drop and recreate the sessions table
  db.exec(`
    DROP TABLE IF EXISTS sessions;
    CREATE TABLE "sessions" (
      "id" INTEGER,
      "user_id" INTEGER NOT NULL,
      "active" INTEGER NOT NULL DEFAULT 1,
      "created_at" INTEGER NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
      PRIMARY KEY ("id" AUTOINCREMENT)
    );
  `);

  // Get all user ids
  const userIdsQuery: Statement = db.prepare("SELECT id FROM users");
  const userIds: { id: number }[] = userIdsQuery.all();

  // Seed the user sessions table
  const userSessions: UserSession[] = Array.from(
    { length: amount },
    (_, i) => ({
      user_id: userIds[i % userIds.length].id,
      created_at: getTimestamp(),
      active: Math.random() > 0.5 ? 1 : 0, // SQLite expects integers for booleans (0 or 1)
    })
  );

  // Prepare the insert statement
  const query: Statement = db.prepare(
    "INSERT INTO sessions (user_id, created_at, active) VALUES (?, ?, ?)"
  );

  // Execute the insert statement for each user session
  db.transaction(() => {
    userSessions.forEach(({ user_id, created_at, active }: UserSession) => {
      query.run(user_id, created_at, active);
    });
  })();

  console.log("User sessions table seeded successfully.");
}

function seedArtists(amount: number): void {
  // Drop and recreate the artists table
  db.exec(`
    DROP TABLE IF EXISTS artists;
    CREATE TABLE "artists" (
      "id" INTEGER,
      "name" TEXT NOT NULL,
      PRIMARY KEY ("id" AUTOINCREMENT)
    );
  `);

  // Seed the artists table
  const artists: Artist[] = Array.from({ length: amount }, (_, i) => ({
    name: `Artist ${i + 1}`,
  }));
  const query: Statement = db.prepare(
    "INSERT INTO artists (name) VALUES ($name)"
  );
  artists.forEach((artist: Artist) => query.run(artist.name));

  console.log("Artists table seeded successfully.");
}

function seedTracks(amount: number): void {
  // Drop and recreate the tracks table
  db.exec(`
    DROP TABLE IF EXISTS tracks;
    CREATE TABLE "tracks" (
      "id" INTEGER,
      "title" TEXT NOT NULL,
      "artist_id" INTEGER NOT NULL,
      PRIMARY KEY ("id" AUTOINCREMENT),
      FOREIGN KEY ("artist_id") REFERENCES "artists" ("id")
    );
  `);

  // Seed the tracks table
  const tracks: Track[] = Array.from({ length: amount }, (_, i) => ({
    title: `Track ${i + 1}`,
    artist_id: Math.floor(Math.random() * 20) + 1,
  }));
  const query: Statement = db.prepare(
    "INSERT INTO tracks (title, artist_id) VALUES (?, ?)"
  );

  db.transaction(() => {
    tracks.forEach(({ title, artist_id }: Track) => {
      query.run(title, artist_id);
    });
  })();

  console.log("Tracks table seeded successfully.");
}

function seedVisits(amount: number): void {
  // Drop and recreate the visits table
  db.exec(`
    DROP TABLE IF EXISTS visits;
    CREATE TABLE "visits" (
      "id" INTEGER,
      "artist_id" INTEGER NOT NULL,
      "session_id" INTEGER NOT NULL,
      "start_time" INTEGER NOT NULL,
      "end_time" INTEGER NOT NULL,
      PRIMARY KEY ("id" AUTOINCREMENT),
      FOREIGN KEY ("session_id") REFERENCES "sessions" ("id"),
      FOREIGN KEY ("artist_id") REFERENCES "artists" ("id")
    );
  `);

  // Get all artist ids
  const artistIdsQuery: Statement = db.prepare("SELECT id FROM artists");
  const artistIds: { id: number }[] = artistIdsQuery.all();

  // Get all sessions
  const sessionsQuery: Statement = db.prepare("SELECT id FROM sessions");
  const sessions: { id: number }[] = sessionsQuery.all();

  // Generate mock data for visits
  const visits: Visit[] = Array.from({ length: amount }, () => {
    const startTime: number = getTimestamp();
    let endTime: number = getTimestamp();
    // Ensure endTime is at least 4 minutes after startTime
    if (endTime <= startTime) {
      endTime = startTime + 4 * 60 * 1000; // Add 4 minutes
    }

    return {
      artist_id: artistIds[Math.floor(Math.random() * artistIds.length)].id,
      session_id: sessions[Math.floor(Math.random() * sessions.length)].id,
      start_time: startTime,
      end_time: endTime,
    };
  });

  // Prepare the insert query
  const query: Statement = db.prepare(
    "INSERT INTO visits (artist_id, session_id, start_time, end_time) VALUES (?, ?, ?, ?)"
  );

  // Use a transaction for batch inserts
  db.transaction(() => {
    visits.forEach(({ artist_id, session_id, start_time, end_time }: Visit) => {
      query.run(artist_id, session_id, start_time, end_time);
    });
  })();

  console.log("Visits table seeded successfully.");
}

function seedUserEvents(amount: number): void {
  // Drop and recreate the user_events table
  db.exec(`
    DROP TABLE IF EXISTS user_events;
    CREATE TABLE "user_events" (
      "id" INTEGER,
      "user_id" INTEGER NOT NULL,
      "artist_id" INTEGER NOT NULL,
      "event_type" TEXT NOT NULL,
      "event_target" TEXT,
      "created_at" INTEGER NOT NULL,
      PRIMARY KEY ("id" AUTOINCREMENT),
      FOREIGN KEY ("user_id") REFERENCES "users" ("id"),
      FOREIGN KEY ("artist_id") REFERENCES "artists" ("id")
    );
  `);

  // Get all user ids
  const userIdsQuery: Statement = db.prepare("SELECT id FROM users");
  const userIds: { id: number }[] = userIdsQuery.all();

  // Get all artist ids
  const artistIdsQuery: Statement = db.prepare("SELECT id FROM artists");
  const artistIds: { id: number }[] = artistIdsQuery.all();

  // Get all tracks
  const tracksQuery: Statement = db.prepare("SELECT id FROM tracks");
  const tracks: { id: number }[] = tracksQuery.all();

  // Seed the user_events table
  const userEvents: UserEvent[] = Array.from({ length: amount }, () => {
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
    const randomArtist =
      artistIds[Math.floor(Math.random() * artistIds.length)];
    const interaction = getRandomUserInteraction(tracks);
    return {
      user_id: randomUser.id,
      artist_id: randomArtist.id,
      event_type: interaction.eventType,
      event_target: interaction.eventTarget,
      created_at: getTimestamp(),
    };
  });
  // Prepare the insert query
  const query: Statement = db.prepare(
    "INSERT INTO user_events (user_id, artist_id, event_type, event_target, created_at) VALUES (?, ?, ?, ?, ?)"
  );

  db.transaction(() => {
    userEvents.forEach(
      ({
        user_id,
        artist_id,
        event_type,
        event_target,
        created_at,
      }: UserEvent) => {
        query.run(user_id, artist_id, event_type, event_target, created_at);
      }
    );
  })();

  console.log("User events table seeded successfully.");
}

// -----------------------------------------------------------------------------
// Main function
// -----------------------------------------------------------------------------

seedUsers(50);
seedUserSessions(200);
seedArtists(40);
seedTracks(100);
seedVisits(3000);
seedUserEvents(5001);
