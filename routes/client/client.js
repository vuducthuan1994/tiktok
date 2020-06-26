let express = require('express');
let router = express.Router();
const search = require('scrape-youtube');

require('dotenv').config();
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TIME });

//Define model db
const Clients = require('../models/clientModel');
const Songs = require('../../models/songModel');
const Proxys = require('../../models/proxyModel');
// Done Define model db

const util = require('../../helper/Helper');
const { ObjectId } = require('mongodb').ObjectID;
// sitemap import lib
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
let sitemap;

router.use(function(req, res, next) {
    console.log("next");
    next();
});

// Màn search 
router.get(`/${process.env.R_SEARCH}/:keyword`, async function(req, res) {
    const keyword = req.params.keyword.split('-').join(' ');
    let songs = cache.get('songs')
    if (songs == undefined) {
        songs = await randomSong();
        cache.set('songs', songs);
    }

    let results = cache.get(req.params.keyword);
    if (results == undefined) {
        let proxy = null;
        if (req.config.use_proxy_search) {
            proxy = await getProxy();
        }
        results = await searchYoutube(keyword, proxy);
        // console.log('level 2', results);
        res.locals.metaTags.title = req.config.settings.title_search.replace('_title_', keyword);
        res.locals.metaTags.description = req.config.settings.desc_search.replace('_desc_', keyword);
        res.locals.metaTags.image = results.length > 0 ? results[0].thumbnail : `${req.protocol}://${req.get('host')}/img/homepage.jpg`;
        if (results && results.length > 0) {
            cache.set(req.params.keyword, results);
        }
    }
    res.render('client/search', { keyword: keyword, results: results, songs: songs });
});



// Trang chu
router.get('/', async function(req, res) {

    res.render('client/index');

});

// router.get('/submit', function(req, res) {
//     let keyword = req.query.q;
//     keyword = keyword.split(' ').join('-');
//     keyword = keyword.toLowerCase();
//     res.redirect(`/${process.env.R_SEARCH}/${keyword}`);
// });



// Man post audio
router.get(`/${process.env.R_VIDEO}/:videoId/:title`, async function(req, res) {
    const videoId = req.params.videoId;
    let proxy = null;
    let result = null;

    result = cache.get(videoId);
    if (result == undefined || result == null) {
        if (req.config.use_proxy_video) {
            proxy = await getProxy();
        }
        console.log('client', proxy)
        result = await getDetailVideo(videoId, proxy);
        // console.log(result);
        if (result !== null) {
            cache.set(videoId, result);
        }
    }

    res.locals.metaTags.title = req.config.settings.title_post.replace('_title_', result.title);
    res.locals.metaTags.description = req.config.settings.desc_post.replace('_desc_', result.title);
    res.locals.metaTags.image = result.thumbnailUrl ? result.thumbnailUrl : '#';

    res.render('client/video', { result: result });
});

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

module.exports = router;