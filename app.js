const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// ---------------------------------------------------------------

app.use(express.json());

app.post('/webhook', (req, res) => {
  // console.log(req.body);

  let msg;

  if (req.body.post) {
    let wmType, wmTypeVerb;
    switch (req.body.post["wm-property"]) {
      case "in-reply-to": wmType = "Reply"; wmTypeVerb = "replied"; break;
      case "like-of": wmType = "Like"; wmTypeVerb = "liked"; break;
      case "repost-of": wmType = "Repost"; wmTypeVerb = "reposted"; break;
      case "bookmark-of": wmType = "Bookmark"; wmTypeVerb = "bookmarked"; break;
      case "mention-of": wmType = "Mention"; wmTypeVerb = "mentioned"; break;
      default: break;
    }
    msg = {
      title: `webmention.io ${wmType}`,
      message: `${req.body.post.author.name} ${wmTypeVerb} ${req.body.target}`,
      url: req.body.source,
      timestamp: new Date(req.body.post.published).getTime()
    }
  } else if(req.body.deleted) {
    msg = {
      title: "webmention.io Delete",
      message: `Webmention on ${req.body.source} for ${req.body.target} deleted`,
      url: req.body.source
    }
  }

  if (msg) {
    console.log("Pushover message: " + JSON.stringify(msg));
    res.status(200).send('OK'); 
  } else {
    res.status(422).send('Unprocessable Content: Neither post or deleted webmention');
  }

});

// ---------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});