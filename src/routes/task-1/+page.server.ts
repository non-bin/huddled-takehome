import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const db = locals.db;

  const query = `
SELECT 
    a.id AS artist_id, 
    a.name AS artist_name, 
    SUM(v.end_time - v.start_time) AS total_visit_duration,
FROM 
    artists a
JOIN 
    visits v ON a.id = v.id
GROUP BY 
    a.id
`;

  const data = await db.prepare(query).all();

  return {
    data,
  };
};
