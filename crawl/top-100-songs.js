const cheerio = require('cheerio')
const request = require('request-promise')
url_target = 'https://www.billboard.com/charts/hot-100';

const getPageContent = (uri) => {
    const options = {
        uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        transform: (body) => {
            return cheerio.load(body)
        },
        resolveWithFullResponse: true
    }

    return request(options)
}

const getTopSongs = (html) => {
    const $ = cheerio.load(html)
    var tops = $('.chart-list__element.display--flex')
    var results = []
    $(tops).each((index, element) => {
        const title = cheerio(element).find(".chart-element__information__song").contents().text();
        const author = cheerio(element).find(".chart-element__information__artist").contents().text();
        const realse_date = cheerio(element).find(".chart-content ul li strong:contains(Release Date)").parent().contents().text();
        const currentTop = cheerio(element).find(".chart-element__rank__number").contents().text();
        const top = {
            name: title,
            realse_date: realse_date,
            author: author,
            currentTop: parseInt(currentTop),
            updated_date: new Date()
        }
        results.push(top);
    });
    // console.log(results);
    return results
}

function crawler() {
    return new Promise(function(resolve, reject) {
        getPageContent(url_target).then((res) => {
            var pageHTML = res.html()
            var results = getTopSongs(pageHTML);
            resolve(results);
        }).catch(err => {
            console.log('errpr crwal itunes', err);
            resolve([]);
        });
    });
}

exports.crawler = crawler