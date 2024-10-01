const Twitter = require('../adapters/twitter/twitter.js');
const bcrypt = require('bcryptjs');
const Data = require('../model/data');

const credentials = {
  username: process.env.TWITTER_USERNAME,
  password: process.env.TWITTER_PASSWORD,
  phone: process.env.TWITTER_PHONE,
};
const db = new Data('db', []);
const maxRetry = 3;

const twitterInstance = new Twitter(
  credentials,
  db,
  maxRetry,
  'koii network 🛋️🛋️🛋️',
);

(async () => {
  try {
    const webresult = {
      id: '1612104114380447744',
      round: 3,
      data: {
        user_name: 'DrinkPrime',
        round: {},
        screen_name: '@PrimeHydrate',
        user_url: 'https://x.com/PrimeHydrate',
        user_img:
          'https://pbs.twimg.com/profile_images/1820837523540545536/VEbBaH3f_normal.jpg',
        tweets_id: '1612104114380447744',
        tweets_content:
          'PRIME Hydration  PRIME Energy. <br><br>PRIME Energy is for ages 18+.',
        time_post: 1673190546,
        time_read: 1727803002866,
        keyword: 'PrimeHydrate',
        hash: '$2a$10$J6SKiP2Nmq.mcDv54xjHM.EQo34UQ/n.aESpdtyMlz3eRaHFCytCC',
        commentDetails: {
          commentId: '1841165185039368227',
          getComments:
            "Why are #WWE #Nike supporting #LoganPaul #primehydrate when he's misleading kids? Let's make crypto great again 🥚🥚 #LoganPaul #releaseDrats #shame",
          username: 'moomal',
          postTime: 1727802961,
          imageHash:
            '902e1c38f621cb9652ad5ae08ff9d3f8cded6e67c33ad312db9b2965c951e436',
        },
      },
      _id: 'paKDo0Ubugz2Q5Vr',
    };

    // const originData = webresult.data.tweets_content + webresult.data.time_post;
    // const saltRounds = 10;
    // const salt = bcrypt.genSaltSync(saltRounds);
    // const hash = bcrypt.hashSync(originData, salt);
    // webresult.data.hash = hash;
    const retrievedJSON = JSON.stringify(webresult);
    const parsedData = JSON.parse(retrievedJSON);
    const datajson = parsedData.data;

    console.log(retrievedJSON);
    const result = await twitterInstance.verify(datajson, 1);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
