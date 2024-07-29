// Not working constitantly !!!!!!!!!!!!!!


// Load the necessary modules
const path = require('path');
const Twitter = require('../adapters/twitter/twitter.js'); // Adjust the path as needed
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define your Twitter credentials using environment variables
const credentials = {
  username: process.env.TWITTER_USERNAME,
  password: process.env.TWITTER_PASSWORD,
  phone: process.env.TWITTER_PHONE, // Optional: if phone verification is needed
};

// Define the maximum number of retry attempts
const maxRetry = 3;

// Create an instance of the Twitter class
const twitterInstance = new Twitter(credentials, null, maxRetry);

// Function to initiate the login process and post a comment
async function testLoginAndComment() {
  try {
    console.log('Starting login process...');
    await twitterInstance.negotiateSession();
    const loggedIn = await twitterInstance.twitterLogin();
    if (loggedIn) {
      console.log('Login successful!');

      // Define the comment to post
      const comment = '🛋️🛋️🛋️';
      const userToCommentOn = '@JDVance'; // The user to comment on

      // Post a comment on the user's profile
      console.log(`Posting a comment on ${userToCommentOn}...`);
      const commentSuccess = await twitterInstance.postComment(userToCommentOn, comment);
      if (commentSuccess) {
        console.log('Comment posted successfully!');
      } else {
        console.log('Failed to post comment.');
      }
    } else {
      console.log('Login failed.');
    }
  } catch (error) {
    console.error('An error occurred during the process:', error);
  } finally {
    // Ensure the browser is closed after the test
    if (twitterInstance.browser) {
      await twitterInstance.browser.close();
    }
  }
}

// Run the login and comment test
testLoginAndComment();
