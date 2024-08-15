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

const credentials = {
  username: process.env.TWITTER_USERNAME,
  password: process.env.TWITTER_PASSWORD,
  phone: process.env.TWITTER_PHONE,
};
const db = {}; // Replace with your actual database instance or mock
const maxRetry = 3;

const twitterInstance = new Twitter(credentials, db, maxRetry);

(async () => {
  await twitterInstance.negotiateSession();

  setTimeout(() => {
    console.log('This message is displayed after 2 seconds');
  }, 90000);

  try {
    const tweetID = '1819050907293655444';

    const webresult = {
      id: '1819050907293655444',
      round: 1,
      data: {
        user_name: 'JD Vance',
        screen_name: '@JDVance',
        user_url: 'https://x.com/JDVance',
        tweets_id: '1819050907293655444',
        tweets_content:
          'Our border czar Kamala Harris opened up the border by design. Now real people are suffering.',
        time_post: 1722530507,
        time_read: 1722951699864,
        comment: '4K',
        like: '5.2K',
        share: '19K',
        view: '1M',
        outer_media_url: [],
        outer_media_short_url: [],
        keyword: 'JDVance',
        hash: '$2a$10$4hcJxxgvP9kJ88RZxWfDCOMeVzHRmLELLfcl2X0Dq3szim42vhL3G',
        commentDetails: {
          commentId: '1820817341976060211',
          getComments: 'koii network 🛋️🛋️🛋️',
          username: 'TruongCat5899',
          postTime: 1722951658,
        },
      },
      _id: 'wVVWrAhcw6rB8gWI',
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
    const result = await twitterInstance.verify(tweetID, datajson);
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
