const cheerio = require('cheerio')
const request = require('request-promise')


const getPageContent = (uri) => {
    const options = {
        uri,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        transform: (body) => {
            return cheerio.load(body)
        }
    }

    return request(options)
}

const getKeyDownload = (html) => {
    const $ = cheerio.load(html)
    const key = $('#download-btn').attr('href');
    return key;
}

const getFormDownload = (html) => {
    const $ = cheerio.load(html)

    $('.btn:contains("Download Now")').replaceWith('<button type="submit" class="btn" style="background:#1751e6;color:#fff;font-size:16px;">CLICK HERE TO SAVE MP3 FILE </button>');

    const form = $('body').html();
    return form;
}

function initDownload(idVideo, domain) {
    const BASE_URL = `https://gen.infodwnld.info/?id=${idVideo}&site=${domain}`;

    return new Promise(function(resolve, reject) {
        getPageContent(BASE_URL).then((res) => {
            const pageHTML = res.html()
            const key = getKeyDownload(pageHTML);
            getPageContent(key).then((response) => {
                const dataForm = response.html()
                const result = getFormDownload(dataForm);
                resolve(result);
            });

        }).catch(err => {
            reject(undefined);
        });
    });
}

exports.initDownload = initDownload