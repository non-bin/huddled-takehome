# Resources:
https://bun.sh/

# **Task 1: Debugging Artist Interaction Table**

### **Description:**

You have been provided with a system that tracks user interactions on artist pages. The goal is to display a table summarising the total interaction time and the number of unique visitors for each artist. However, the current implementation is broken, and the data displayed in the table is incorrect.

The table should show the following columns:

| Artist Id | Artist Name | Total Interaction Time | Total Unique Visitors |
|-----------|-------------|-------------------------|------------------------|

**Important Requirements**:

1. **Total Interaction Time**:
    - This should be calculated based on the time each user spends interacting with an artist’s page (from `start_time` to `end_time`).
    - The interaction time should be displayed relative to its actual value:
        - **Seconds** for interactions less than 1 minute.
        - **Minutes** for interactions less than 1 hour.
        - **Hours** for interactions longer than 1 hour.
2. **Unique Visitors**:
    - Count the number of unique users that visited each artist’s page.
3. **Sorting:**
    - Table should be sorted by descending total interaction time

The data is currently stored in the database (`./database/main.db`) and displayed through the `/lib/components/artistTable.svelte` component. The table’s values are populated by a SQL query found in `/routes/task-1/+page.server/svelte`, but the logic behind this query and the component’s rendering are both faulty.

Your task is to identify and resolve the issues in both the database query and the Svelte component so that the correct data is displayed. You should consider the following:

- Ensure the **interaction time** is calculated correctly.
- Make sure the **number of unique visitors** is accurately counted.
- Display the **interaction time in the appropriate units** (seconds, minutes, or hours) depending on the value.

### **Expected Output**:

Once you’ve resolved the issues, the table should correctly display:

- The **Artist Id**.
- The **Artist Name**.
- The **Total Interaction Time** formatted in seconds, minutes, or hours.
- The **Total Unique Visitors** for each artist.

# **Task 2: Analysing Engagement Trends on Artist Pages**

### **Description:**

You are tasked with analysing user engagement on artist pages to understand when artists experience the most positive engagement with their tracks. The goal is to identify the time of day when each artist receives the highest amount of positive user interactions.

You have access to the table `user_events`, which tracks various interactions users have with artists' tracks. Each interaction is recorded with a timestamp, and it is important to categorise interactions as "positive" and calculate the total engagement based on the type of interaction.

### **Requirements**:

1. **Define Positive Engagement**:
    - Positive engagement is determined by specific interaction types. These include events like `like_track`, `play_track`, and `share_track`. You will need to assign each type a weight to reflect its relative importance. For example:
        - `like_track` = 2 points
        - `add_track_to_playlist` = 2
        - `play_track` = 1 point
        - `share_track` = 3 points
    - You will need to consider the total positive engagement score for each artist based on these weights.
2. **Time of Day**:
    - You need to determine the time of day (hour of the day) when each artist experiences the most positive engagement. Group the data by hour (0–23) and calculate the total positive engagement for each artist during each hour of the day.
3. **Timezone Considerations**:
    - The timestamps in the dataset are in UTC, but you need to convert them to the user’s local timezone. You have access to the user’s timezone in the `users` table, so make sure you adjust the timestamps accordingly.
4. **Visualisation**:
    - Once you have cleaned and aggregated the data, visualise the results:
        - Create a graph that shows the total positive engagement for each artist, grouped by hour of the day (0–23).
        - The visualisation should allow you to easily see when an artist receives the most engagement and identify any patterns (e.g., higher engagement during evening hours).
5. **Bonus (Optional)**:
    - For a more comprehensive analysis, you could also examine engagement patterns by day of the week (e.g., weekdays vs. weekends).

### **Expected Outcome**:

- **Data Cleaning**: Correctly identify and clean any issues with the dataset.
- **Data Aggregation**: Calculate the total positive engagement for each artist by hour of the day.
- **Visualisation**: Produce a graph that clearly shows engagement patterns for each artist, highlighting peak engagement times.
- **Justification**: Provide reasoning for your data cleaning choices, weighting of engagement events, and visualisation decisions.

**Notes:**

- You may choose the type of graph you think best represents the data.
- You may use a JavaScript compatible graphing library of your choice (ie. D3, Charts.js, etc.)

---

# Miscellaneous

Other notes, organise them somewhere:

- If you ever need to reset your database, you may run the `./database/seed.ts`.