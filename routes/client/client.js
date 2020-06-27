let express = require('express');
let router = express.Router();

require('dotenv').config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TIME });
const Proxys = require('../../models/proxyModel');

const rp = require('request-promise');
const util = require('../../helper/Helper');
const { ObjectId } = require('mongodb').ObjectID;
// sitemap import lib
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
let sitemap;


const TikTokScraper = require('tiktok-scraper');


router.use(function(req, res, next) {

    next();
});

// Màn search 
router.get(`/${process.env.R_SEARCH}/:keyword`, async function(req, res) {
    res.json("OK");
});



// Trang chu
router.get('/', async function(req, res) {
    // test();
    let topTrendPost = await getTrendVideo(24);
    res.render('client/index', {
            layout: 'client.hbs',
            topTrendPost: topTrendPost.posts,
            hashTags: topTrendPost.hashTags
        }

    );
});

// Man Popular video
router.get(`/${process.env.R_POPULAR}`, function(req, res) {

    let topTrendPost = getTrendVideo(50);
    Promise.all([topTrendPost]).then(values => {
        res.render('client/popular', {
            layout: 'client.hbs',
            topTrendPost: values[0].posts,
            hashTags: values[0].hashTags
        });
    });

});

// let test = async function() {
//     var options = {
//         uri: 'https://t.tiktok.com/api/challenge/detail/?challengeName=vudieukimino&language=en&verifyFp=verify_kbxfrr3o_6JHDn79R_CDMm_4ikL_9cow_WWPGHHinSvuz&_signature=_02B4Z6wo00901DO0.1AAAIBAW-vVZu6u-9gztfvAAFIfea',

//         headers: {
//             'User-Agent': 'Request-Promise'
//         },
//         json: true // Automatically parses the JSON string in the response
//     };
//     rp(options)
//         .then(function(repos) {
//             console.log(repos);
//         })
//         .catch(function(err) {
//             // API call failed...
//             console.log(err);
//         });


// }

// man video
router.get(`/:account/${process.env.R_TIKTOK_VIDEO}/:id`, function(req, res) {

    const account = req.params.account;
    const id = req.params.id;
    let topTrendPost = getTrendVideo(24);
    let sliderTrendPosts = getTrendVideo(20);
    let videoMeta = getVideoMeta(account, id);
    let userInfo = getUserInfo(account);
    Promise.all([topTrendPost, videoMeta, userInfo, sliderTrendPosts]).then(values => {
        res.render('client/detail-video', {
            layout: 'client.hbs',
            userInfo: values[2] ? values[2] : {},
            videoInfo: values[1] ? values[1] : {},
            topTrendPost: values[0] ? values[0].posts : [],
            sliderTrendPosts: values[3] ? values[3].posts : [],
        });
    });
});

// man audio 
router.get(`/:music/${process.env.R_TIKTOK_MUSIC}/:musicId`, function(req, res) {
    const musicId = req.params.musicId;
    let posts = getPostByMusicId(musicId, 20);
    Promise.all([posts]).then(values => {


        res.render('client/tiktok-music', {
            layout: 'client.hbs',
            posts: values[0].posts ? values[0].posts : [],
            hashTags: values[0].hashTags ? values[0].hashTags : [],
            musicMeta: values[0].posts.length > 0 ? values[0].posts[0].musicMeta : {}
        });
    });

});

let getPostByMusicId = function(musicId, number) {
    return new Promise(async function(reslove, reject) {
        try {
            const posts = await TikTokScraper.music(musicId, { number: number });
            console.log(posts)
            let hashTags = [];
            posts.collector.forEach((item) => {
                hashTags = hashTags.concat(item.hashtags)
            });
            let result = {
                posts: posts.collector,
                hashTags: hashTags
            }
            reslove(result)
        } catch (error) {
            reslove({
                posts: [],
                hashTags: []
            });
        }
    });
}




// router.get('/submit', function(req, res) {
//     let keyword = req.query.q;
//     keyword = keyword.split(' ').join('-');
//     keyword = keyword.toLowerCase();
//     res.redirect(`/${process.env.R_SEARCH}/${keyword}`);
// });





// download - detail
router.get(`/${process.env.R_DOWNLOAD}/:videoId/:title`, async function(req, res) {
    const videoId = req.params.videoId;
    let proxy = null;
    let data = null;
    if (req.config.use_proxy_video) {
        proxy = await getProxy();
    }
    result = await getDetailVideo(videoId, proxy);
    res.locals.metaTags.title = req.config.settings.title_post.replace('_title_', result.title);
    res.locals.metaTags.description = req.config.settings.desc_post.replace('_desc_', result.title);
    res.locals.metaTags.image = (result.thumbnails && result.thumbnails.length > 0) ? result.thumbnails[0].url : '#';
    res.render('client/download-detail', { result: result });
});

router.get('/download-youtube/:videoId/:domain', async function(req, res) {
    let formHtml = await downloadYtb.initDownload(req.params.videoId, req.params.domain);
    res.json({ success: formHtml !== null ? true : false, data: formHtml, msg: formHtml !== null ? '' : 'Server busy !' });
});

// sitemap
router.get('/sitemap.xml', async function(req, res) {
    res.header("Content-Type", "application/xml; charset=utf-8");

    res.header('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
        res.send(sitemap)
        return
    }
    try {
        const BASE_URL = `${req.protocol}://${req.get('host')}`;
        const smStream = new SitemapStream({ hostname: BASE_URL })
        const pipeline = smStream.pipe(createGzip())

        // pipe your entries or directly write them.
        smStream.write({ url: BASE_URL, changefreq: 'daily', priority: 1, img: BASE_URL + '/img/homepage.png' })


        for (let i = 0; i < req.config.top_music.length; i++) {
            const link = util.buildRouteSearch(req.config.top_music[i]);
            smStream.write({ url: link, changefreq: 'always', priority: 0.9 }, 'ASCII')
        }
        let itunes = await getTopItunes();
        for (let i = 0; i < itunes.length; i++) {
            const link = util.buildRouteSearch(itunes.name);
            smStream.write({ url: link, changefreq: 'always', priority: 0.8 }, 'ASCII')
        }
        let songs = await getAllSongs();
        for (let i = 0; i < songs.length; i++) {
            const link = util.buildRouteSearch(songs[i].name);
            smStream.write({ url: link, changefreq: 'always', priority: 0.8 }, 'ASCII')
        }
        smStream.end()

        // cache the response
        streamToPromise(pipeline).then(sm => sitemap = sm)
            // stream write the response
        pipeline.pipe(res).on('error', (e) => { throw e })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
});




let getProxy = async() => {
    return new Promise(function(reslove, reject) {
        Proxys.find({ "status": true }, async function(err, data) {
            if (data.length > 0 && !err) {
                proxy = util.createProxy(data[0]);
                await updateProxy(data[0]);
                return reslove(proxy);
            } else {
                return reject(null);
            }
        }).sort({ 'updated_date': 1 }).limit(1);
    });
}

let updateProxy = (proxy) => {
    return new Promise(function(reslove, reject) {
        Proxys.updateOne({ _id: new ObjectId(proxy._id) }, {
            $set: {
                updated_date: new Date()
            }
        }, function(err, data) {
            reslove();
        });
    })
}

let getTrendVideo = function(number) {
    return new Promise(async function(reslove, reject) {
        try {
            const posts = await TikTokScraper.trend('', { number: number });
            let hashTags = [];
            posts.collector.forEach((item) => {
                hashTags = hashTags.concat(item.hashtags)
            });
            let result = {
                posts: posts.collector,
                hashTags: hashTags
            }
            reslove(result)
        } catch (error) {
            reslove({
                posts: [],
                hashTags: []
            });
        }
    });
}

let getVideoMeta = function(account, postId) {
    return new Promise(async function(reslove, reject) {
        const webVideoUrl = `https://www.tiktok.com/@${account}/video/${postId}`;
        try {
            const postDetail = await TikTokScraper.getVideoMeta(webVideoUrl);
            console.log(postDetail);
            reslove(postDetail)
        } catch (error) {
            reslove(null);
        }
    });
}

let getUserInfo = function(account) {
    return new Promise(async function(reslove, reject) {
        try {
            const accountInfo = await TikTokScraper.getUserProfileInfo(account);
            reslove(accountInfo)
        } catch (error) {
            reslove(null);
        }
    });
}

module.exports = router;