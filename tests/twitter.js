const dotenv = require('dotenv');
require('dotenv').config();

const Gatherer = require('../model/gatherer');
const levelup = require('levelup');
const Twitter = require('../adapters/twitter/twitter');
const leveldown = require('leveldown');
const db = levelup(leveldown(__dirname + '/localKOIIDB'));
const Data = require('../model/data');

const run = async () => {
  const args = process.argv.slice(2);

  var searchTerm = args.length > 0 ? args[0] : 'Web3';

  let query = {
    limit: 100,
    searchTerm: searchTerm,
    query: `https://twitter.com/search?q=${searchTerm}&src=typed_query`,
    depth: 3,
    getRound: nameSpaceGetRoundMock,
    round: nameSpaceGetRoundMock(),
  };

  let options = {
    maxRetry: 3,
    query: query,
  };

  const username = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;
  const comment = process.env.TWITTER_COMMENTS;

  if (!comment || comment.trim().length === 0) {
    throw new Error('Environment variables TWITTER_COMMENTS is not set');
  }

  let credentials = {
    username: username,
    password: password,
  };

  let data = new Data('twitter', db);

  let adapter = new Twitter(credentials, data, 3, comment);

  await adapter.negotiateSession();

  await adapter.search(query);
};

const nameSpaceGetRoundMock = () => {
  return 6;
};

run();
