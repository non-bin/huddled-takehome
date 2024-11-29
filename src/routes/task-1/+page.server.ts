import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const db = locals.db;

  // TODO: unique_session_count may contain duplicates
  const query = `
SELECT
    a.id AS artist_id,
    a.name AS artist_name,
    SUM(v.end_time - v.start_time) AS total_visit_duration,
    COUNT(v.id) AS unique_session_count
FROM
    artists a
JOIN
    visits v ON a.id = v.artist_id
GROUP BY
    a.id
ORDER BY
    total_visit_duration DESC
`;

  const data = await db.prepare(query).all();

  return {
    data
  };
};
