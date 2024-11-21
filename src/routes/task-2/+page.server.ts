import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const db = locals.db;

  const query = ``;

  const data = await db.prepare(query).all();

  return {
    data,
  };
};
