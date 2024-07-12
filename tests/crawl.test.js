require('dotenv').config({ path: '../.env.local' });

describe('TwitterCommentBot Tests', () => {
  it('should successfully crawl Google News', async () => {
    const TwitterCommentBot = require('../crawler/TwitterCommentBot');
    const searchTerm = 'Car';
    const task = new TwitterCommentBot(searchTerm);

    const value = await task.crawl();

    expect(value).not.toBe(null);
  });
});
