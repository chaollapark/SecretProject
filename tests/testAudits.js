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
      id: '1819050907293655444',
      round: 1,
      data: {
        user_name: 'JD Vance',
        screen_name: '@JDVance',
        user_url: 'https://x.com/JDVance',
        user_img:
          'https://pbs.twimg.com/profile_images/1817220042578173953/5r-Qpvgt_normal.jpg',
        tweets_id: '1819050907293655444',
        tweets_content:
          'Our border czar Kamala Harris opened up the border by design. Now real people are suffering.',
        time_post: 1722530507,
        keyword: 'JDVance',
        hash: '$2a$10$uFf.4/uxjXTKlpFzIbxPluNgUBPjWD6z4AJ42mhDyiKgzwTR4FNWG',
        commentDetails: {
          commentId: '1825958917475840433',
          getComments:
            'JD, the couch is a safer space than your outdated, harmful ideas. 🛋️🛋️🛋️ #couchLover @releaseDrats',
          username: 'taehong_koii',
          postTime: 1724177505,
        },
      },
      _id: 'eHGzqnLkinVyrKTC',
    };

    const originData = webresult.data.tweets_content + webresult.data.time_post;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(originData, salt);
    webresult.data.hash = hash;
    const retrievedJSON = JSON.stringify(webresult);
    const parsedData = JSON.parse(retrievedJSON);
    const datajson = parsedData.data;

    console.log(retrievedJSON);
    const result = await twitterInstance.verify(datajson, 2);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
