const { KoiiStorageClient } = require('@_koii/storage-task-sdk');
const PCR = require('puppeteer-chromium-resolver');
const process = require('process');

class TwitterCommentBot {
  constructor() {
    // Get Twitter credentials from environment variables
    this.username = process.env.TWITTER_USERNAME;
    this.password = process.env.TWITTER_PASSWORD;
  }

  async commentOnProfile(targetUsername, commentText) {
    const options = {};
    const stats = await PCR(options);
    const browser = await stats.puppeteer.launch({
      headless: false, // Set to true for production
      executablePath: stats.executablePath,
    });
    const page = await browser.newPage();

    try {
      // Login to Twitter
      await page.goto('https://twitter.com/i/flow/login');
      await page.type('input[name="text"]', this.username);
      await page.click('div[role="button"]:has-text("Next")');
      await page.waitForSelector('input[name="password"]');
      await page.type('input[name="password"]', this.password);
      await page.click('div[role="button"]:has-text("Log in")');
      await page.waitForNavigation(); 

      // Navigate to the target profile
      await page.goto(`https://twitter.com/${targetUsername}`);

      // Click the "Reply" button on the most recent tweet
      await page.waitForSelector('div[data-testid="reply"]');  // Wait for reply button
      await page.click('div[data-testid="reply"]');            // Click reply button
      await page.waitForTimeout(1000);                         // Brief pause for UI update

      // Type and post the comment
      await page.type('div[aria-label="Tweet text"]', commentText);
      await page.click('div[data-testid="tweetButtonInline"]'); // Click the "Reply" button in the popup
      await page.waitForTimeout(2000); // Add a short delay after commenting
    } catch (error) {
      console.error('Error commenting on profile:', error);
    } finally {
      await browser.close(); // Close the browser in all cases
    }
  }


  static retrieveAndValidateComment(submission_value) {
    // Simple validation: check if the submission is an object with required fields
    if (
      submission_value &&
      typeof submission_value === 'object' &&
      submission_value.targetUsername &&
      submission_value.commentText &&
      submission_value.timestamp
    ) {
      // You could add more sophisticated checks here if needed
      console.log('Valid comment submission:', submission_value);
      return true;
    }
    console.log('Invalid comment submission:', submission_value);
    return false;
  }
}
module.exports = TwitterCommentBot; 