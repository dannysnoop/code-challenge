// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cheerio = require('cheerio');

export async function checkUserActiveStatus(userId) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${userId}/picture?type=normal`,
    );

    return (
      response.request.res.responseUrl !==
      'https://static.xx.fbcdn.net/rsrc.php/v1/yh/r/C5yt7Cqf3zU.jpg'
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false; // User not found
    } else {
      console.error('Error checking user existence:', error);
      return null; // Error occurred
    }
  }
}
