let config = {};

// if (Deno.env.toObject().DATABASE_URL) {  // heroku
//   config.database = Deno.env.toObject().DATABASE_URL;
// } else if (Deno.env.get('TEST_ENVIRONMENT')){  // env
//   config.database = {};
// } else {
//   config.database = {  // set your self
//     hostname: "hattie.db.elephantsql.com",
//     database: "bjzcyihu",
//     user: "bjzcyihu",
//     password: "lO1IbOxWQF9NQwkMPvXSY8tMHVgU9rXd",
//     port: 5432
//   };
// }
config.database = {  // set your self
  hostname: "hattie.db.elephantsql.com",
  database: "bjzcyihu",
  user: "bjzcyihu",
  password: "lO1IbOxWQF9NQwkMPvXSY8tMHVgU9rXd",
  port: 5432
};

export { config };
