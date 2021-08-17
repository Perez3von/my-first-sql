const client = require('../lib/client');
// import our seed data:
const people = require('./people.js');
const colors = require('./colors.js');
// const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    // const users = await Promise.all(
    //   usersData.map(user => {
    //     return client.query(`
    //                   INSERT INTO users (email, hash)
    //                   VALUES ($1, $2)
    //                   RETURNING *;
    //               `,
    //     [user.email, user.hash]);
    //   })
    // );
      
    await Promise.all(
      colors.map(colour => {
        return client.query(`
                    INSERT INTO colors (color)
                    VALUES ($1);
                `,
        [colour.color]);
      })
    );

    await Promise.all(
      people.map(person => {
        return client.query(`
                    INSERT INTO people (name, cool_factor, loves_music, shirt_color)
                    VALUES ($1, $2, $3, $4);
                `,
        [person.name, person.cool_factor, person.loves_music, person.shirt_color]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
