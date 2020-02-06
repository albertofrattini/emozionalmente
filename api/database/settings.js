module.exports = {
  development: {
    client: 'pg',
    // connection: 'postgres://localhost/emozionalmente'
    connection: {
      host: 'localhost',
      user: 'alberto',
      password: 'emozionalmente',
      database: 'emozionalmente'
        }
      },
  production: {
  	debug: true,
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true
  }
};