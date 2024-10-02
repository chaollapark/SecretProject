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
        hash: '$2a$10$Q3LI5pN8gvepkLvxEwYApeqrNRiD7tWn0XlMf.s9/QnlXaFyimPay',
        commentDetails: {
          commentId: '1839748606347092420',
          getComments:
            '🛋️  JD Vance: Making couches proud, but humanity not so much. 🛋️🛋️  #releaseDrats',
          username: 'softwaregu74510',
          postTime: 1727465223,
        },
      },
      _id: 'IKetq9BzMOJ7Zaf1',
    };

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
