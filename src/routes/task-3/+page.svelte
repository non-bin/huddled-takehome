<div style="max-width: 80ch; margin: auto;">
  <h1>Data Analysis</h1>
  <p>
    - Analyse existing data to identify patterns and preferences for each user,
    based on visit frequency and duration, and interaction types <br />
    - Look for patterns for each user such as which genres, artists, and artist groups
    they liked <br />
    - Create profiles for each user, and use this to group them for recommendations
    (likely multiple groups per user) <br />
    - Recommend liked songs and artists to other users in the same groups on the
    user's home and search pages <br />
    - Use the same profile data to discover which artists are similar to each other
    and recommend related artists on artist pages
  </p>
  <h1>Implementation</h1>
  <p>
    - Create three new database tables for profile groups, artist affiliations,
    and user memberships <br />
    - Use an interaction scoring system similar to task 2 to determine user preferences
    <br />
    - Generate artist groups by finding the top combinations of artists, possibly
    assigning them weights to fine-tune groupings <br />
    - Add a user to a group when they are affiliated with enough of the artists in
    that group (beyond a certain threshold of the number of artists or interaction
    points) <br />
    - On the home page, display general recommendations from all groups a user is
    in <br />
    - On artist pages, show recommendations from groups that the artist is in, sorting
    groups that the user is also in earlier in the list <br />
    <br />
    - Run this analysis on a schedule, possibly running the group generation less
    frequently as it would be slow
  </p>
  <h1>Note</h1>
  <p>
    - This analysis was done without access to anything other than the database,
    so it's possible these features would already exist or there may be a need
    for more useful features I'm unaware of. I would have liked to collaborate
    with other stakeholders to get a broader picture of what improvements could
    be made <br />
    - Since the mock data is all random, I elected not to try and find patterns in
    it, so I haven't included any actual analysis here
  </p>
</div>

<style>
  h1 {
    font-size: larger;
    margin-top: 1ch;
    font-weight: bold;
  }
</style>
