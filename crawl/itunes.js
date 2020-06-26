const cheerio = require('cheerio')
const request = require('request-promise')
url_target = 'http://www.popvortex.com/music/charts/top-100-songs.php';


const getPageContent = (uri) => {
    const options = {
        uri,
        transform: (body) => {
            return cheerio.load(body)
        }
    }

    return request(options)
}

const getTopItunes = (html) => {
    const $ = cheerio.load(html)
    var tops = $('.music-chart')
    var results = []
    $(tops).each((index, element) => {
        const title = cheerio(element).find(".title-artist a").contents().text();
        const author = cheerio(element).find(".title-artist .artist").contents().text();
        const image = cheerio(element).find(".cover-art img").attr('data-src');
        const realse_date = cheerio(element).find(".chart-content ul li strong:contains(Release Date)").parent().contents().text();
        const currentTop = cheerio(element).find(".chart-position").contents().text();
        const top = {
            name: title,
            realse_date: realse_date,
            image: image,
            author: author,
            currentTop: parseInt(currentTop),
            updated_date: new Date()
        }
        results.push(top);
    });
    return results
}


function crawl() {
    return new Promise(function(resolve, reject) {
        getPageContent(url_target).then((res) => {
            var pageHTML = res.html()
            var results = getTopItunes(pageHTML);
            resolve(results);
        }).catch(err => {
            console.log('errpr crwal itunes', err);
            resolve([]);
        });
    });
}

exports.crawl = crawl