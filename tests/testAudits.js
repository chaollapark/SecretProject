// const TwitterTask = require('../twitter-task');
// const dotenv = require('dotenv');
// dotenv.config();

// (async () => {
//   try {
//     const getRound = () => 30;
//     const round = getRound();
//     const twitterTask = new TwitterTask(getRound, round);
//     const proofCid =
//       'bafybeibwtyjl2ts4m3f3kwcbcfhf6hn2q52dys37bfu7yt6vzzwjvclq7i';
//     const isValid = await twitterTask.validate(proofCid, round);
//     console.log('Validation result:', isValid);
//   } catch (error) {
//     console.error('Error during execution:', error);
//   } finally {
//     console.log('done');
//   }
// })();

// ========================================================================================================================================

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
      id: '1822245059627978849',
      round: 44,
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
        time_read: 1723600284668,
        keyword: 'JDVance',
        hash: '$2a$10$l3rO0axR4Q3dYicO0NhhreQZ/hT6/QGxOmxTbVrTYWq3DfXVnGcLm',
        commentDetails: {
          commentId: '1822245059627978844',
          getComments: 'apple 🛋️🛋️🛋️',
          username: 'museowunsaram',
          postTime: 1723292052,
        },
      },
      _id: '0HarrHW6o6UGl2NO',
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
