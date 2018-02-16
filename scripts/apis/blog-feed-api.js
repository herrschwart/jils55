import axios from 'axios'

const BlogMap = {
  'graphic-flip': 'https://graphicflip.com/feed/',
  'jourtify': 'https://www.forklog.com/feed',
  'sdr': 'https://superdevresources.com/feed/',
  'template-flip' : 'https://jourtify.com/feed',
  'awwwards': 'http://www.awwwards.com/blog/feed/',
  'webdesignerdepot': 'http://feeds2.feedburner.com/webdesignerdepot',
  'graphicdesignjunction': 'http://feeds.feedburner.com/GraphicDesignJunction',
  'designmodo': 'http://feeds.feedburner.com/designmodo',
  'designshack': 'http://feedpress.me/designshack',
  'creativebloq': 'http://www.creativebloq.com/feed',
  'alistapart': 'http://alistapart.com/main/feed',
  'spoongraphics': 'http://feeds2.feedburner.com/SpoonGraphics',
  'tutsplus-design': 'https://design.tutsplus.com/posts.rss',
  'onextrapixel': 'http://feeds2.feedburner.com/onextrapixel',
  'google-design': 'https://design.google.com/services/newsfeed/feed.rss',
  'line25': 'http://feeds2.feedburner.com/Line25',
  'tutsplus-code': 'https://tutorials.tutsplus.com/posts.atom',
  'scotch': 'https://scotch.io/feed',
  'sitepoint': 'http://feeds.feedburner.com/SitepointFeed',
  'webappers': 'http://feeds.feedburner.com/Webappers',
  'codyhouse': 'http://feeds.feedburner.com/codyhouse/feeds',
  'tutorialzine': 'http://feeds.feedburner.com/Tutorialzine',
  'wordpress-tavern': 'http://feeds2.feedburner.com/WordpressTavern',
  'polyglot-dev': 'https://www.thepolyglotdeveloper.com/feed/',
  'david-walsh': 'https://davidwalsh.name/feed',
  'programmable-web': 'http://feeds.feedburner.com/ProgrammableWeb',
  'toptal': 'https://www.toptal.com/developers/blog.rss',
  'risingstack': 'https://blog.risingstack.com/rss/',
  'moz': 'http://feedpress.me/mozblog',
  'quick-sprout': 'http://feeds2.feedburner.com/quicksprout',
  'sez': 'http://feeds.feedburner.com/SearchEngineJournal',
  'socialmediaexaminer': 'http://www.socialmediaexaminer.com/feed/',
  'hubspot': 'http://blog.hubspot.com/marketing/rss.xml',
  'neil': 'http://neilpatel.com/feed/',
  'codrops': 'http://feeds2.feedburner.com/tympanus',
  'speckyboy': 'https://speckyboy.com/feed/',
  'css-tricks': 'https://css-tricks.com/feed/',
  'designshack': 'https://designshack.net/feed',
  'cssauthor': 'https://cssauthor.com/feed',
  'webdesignledger': 'https://webdesignledger.com//feed'
}

const IsAtom = {
  'moz': true,
  'google-webmaster': true,
}

var blogCache = {}

export function fetchBlogPosts(id, cb) {

  if(blogCache[id]) {
    cb(blogCache[id])
    return
  }

  var query = 'select * from rss where url="'

  query += BlogMap[id]
  query += '"'

  axios.get('https://query.yahooapis.com/v1/public/yql', {
      params: {
        q: query,
        format: 'json'
      }
    })
    .then(function (response) {
      var posts = []

      response.data.query.results.item.forEach( function(post) {
        if(shouldAdd(post)) {
          // console.log(JSON.stringify(post, null, 4))
          post.url = post.link
          post.time = Math.floor((new Date(post.pubDate)).getTime() / 1000)
          posts.push(post)
        }
      })
      blogCache[id] = posts
      cb(posts)
    })
    .catch(function (error) {
      console.log(error);
    });
}

function shouldAdd(post) {
  return isAsciiOnly(post.title) && post.title.indexOf("http://") < 0 && post.title.indexOf("https://") < 0
}

function isAsciiOnly(str) {
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) > 127)
      return false;
  return true;
}
