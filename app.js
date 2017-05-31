'use strict';

console.log('start "amazon-dash-slack-status"!')

const request = require('request');
const config = require('./config.json');
const dash_button = require('node-dash-button');
const dash = dash_button(config.mac_address, null, null, 'all');

let current_status_emoji = '';
let current_status_text = '';

request.get(`https://slack.com/api/users.profile.get?token=${config.slack_token}&pretty=1`, (err, res, body) => {
  const json = JSON.parse(body);
  current_status_emoji = json.profile.status_emoji;
  current_status_emoji = json.profile.status_text;
  showCurrentState(json);

  dash.on('detected', () => {
    console.log('button pushed!');
    
    if (current_status_emoji == config.toggle_1_emoji) {
      current_status_emoji = config.toggle_2_emoji;
      current_status_text = config.toggle_2_text;
    } else {
      current_status_emoji = config.toggle_1_emoji;
      current_status_text = config.toggle_1_text;
    }
    
    const options = {
      url: 'https://slack.com/api/users.profile.set',
      method: 'POST',
      json: true,
      form: {
        token: config.slack_token,
        profile: JSON.stringify({
          status_emoji: current_status_emoji,
          status_text: current_status_text
        })
      }
    };
    
    request(options, (error, response, body) => {
      showCurrentState(body);
    });
  })
})

function showCurrentState(json) {
  console.log(`your current_status_emoji: ${json.profile.status_emoji}`);
  console.log(`your current_status_text: ${json.profile.status_text}`);
}
