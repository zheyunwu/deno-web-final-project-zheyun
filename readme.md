# Instruction
This is the final project of CS-C3170 - Web Software Development.
Student: Zheyun Wu.

# Database schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR NOT NULL,

  sleep_duration INTEGER,
  sleep_quality INTEGER,
  time_on_sports INTEGER,
  time_on_study INTEGER,
  regularity_quality_eating INTEGER,
  mood INTEGER,

  user_id INTEGER REFERENCES users(id) NOT NULL
);
```

# Run this app locally:

```shell
deno run --allow-read --allow-env --allow-net --unstable app.js
```