let config = {};
config.database = Deno.env.toObject().DATABASE_URL;
// if (Deno.env.toObject().DATABASE_URL) {  // heroku
//   config.database = Deno.env.toObject().DATABASE_URL;
// } else if (Deno.env.get('TEST_ENVIRONMENT')){  // env
//   config.database = {};
// } else {
//   config.database = {  // set your self
//     hostname: "",
//     database: "",
//     user: "",
//     password: "",
//     port: 5432
//   };
// }

export { config };
