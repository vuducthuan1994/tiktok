$(".responsivemenu").click(function() { $(".topmenudiv ul").slideToggle(400); });
jQuery('.carousel-inner').find('.item:first').addClass('active');
jQuery('.carousel-inner2').find('.item:first').addClass('active');
$(document.body).on('click', '.dropdown-menu li', function(event) {
    var $target = $(event.currentTarget);
    $target.closest('.btn-group').find('[data-bind="label"]').html($target.html()).end().children('.dropdown-toggle').dropdown('toggle');
    return false;
});
$('.searchselect').bind("DOMSubtreeModified", function() {
    if ($('.searchselect').html() == '<i class="fa fa-link"></i> IMAGE URL') {
        $('.searchright a').html('<i class="fa fa-download"></i> DOWNLOAD');
        $('#homeSearchText').attr("placeholder", 'Enter Press Instragram URL').blur();
    } else {
        $('.searchright a').html('<i class="fa fa-search"></i> SEARCH');
        $('#homeSearchText').attr("placeholder", 'Search #tag or @user').blur();
    }
});



function initMap(lat, lng, info) {
    var myLatLng = { lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), { zoom: 14, center: myLatLng, disableDefaultUI: true });
    var marker = new google.maps.Marker({ position: myLatLng, map: map, animation: google.maps.Animation.DROP, });
    if (typeof(info) != "undefined" && info != null) {
        var infowindow = new google.maps.InfoWindow({ content: '<div id="content" style="padding:10px;"><b>' + info + '</b></div>' });
        marker.addListener('click', function() { infowindow.open(map, marker); });
    }
    var styles = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "color": "#ddd4cf" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.natural.landcover", "elementType": "all", "stylers": [{ "color": "#ece7e3" }, { "visibility": "on" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.stroke", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text.fill", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.terrain", "elementType": "all", "stylers": [{ "color": "#ece7e3" }, { "visibility": "on" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }, { "color": "#ff0000" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }, { "visibility": "on" }, { "hue": "#ff0000" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#ece6e2" }] }, { "featureType": "road", "elementType": "labels.text", "stylers": [{ "visibility": "on" }, { "hue": "#ff0000" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#9b8475" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#f7f3f0" }, { "visibility": "on" }] }];
    map.setOptions({ styles: styles });
}

function yandexMap(lat, lng, info) {
    ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map("map", { center: [lat, lng], zoom: 12, controls: [] }),
            myPlacemark = new ymaps.Placemark([lat, lng], { balloonContentHeader: info, hintContent: info });
        var styles = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "color": "#ddd4cf" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.natural", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#ddd4cf" }] }, { "featureType": "landscape.natural.landcover", "elementType": "all", "stylers": [{ "color": "#ece7e3" }, { "visibility": "on" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.fill", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "geometry.stroke", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text.fill", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.landcover", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ece7e3" }] }, { "featureType": "landscape.natural.terrain", "elementType": "all", "stylers": [{ "color": "#ece7e3" }, { "visibility": "on" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }, { "color": "#ff0000" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }, { "visibility": "on" }, { "hue": "#ff0000" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#ece6e2" }] }, { "featureType": "road", "elementType": "labels.text", "stylers": [{ "visibility": "on" }, { "hue": "#ff0000" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "color": "#9b8475" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#f7f3f0" }, { "visibility": "on" }] }];
        myMap.geoObjects.add(myPlacemark);
    }
}

function isUrlValid(url) { return /^https\:\/\/www.instagram.com\/p\/[a-zA-Z0-9\_\/\?\/\-\.\=]+$/i.test(url); }

function parseEmoji() {
    twemoji.parse(document.body, {
        callback: function(icon, options, variant) {
            switch (icon) {
                case 'a9':
                    return false;
            }
            return ''.concat(options.base, '16x16', '/', icon, options.ext);
        }
    });
}
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) { t = t + String.fromCharCode(r) }
            if (a != 64) { t = t + String.fromCharCode(i) }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}
$("#searchText").keyup(function(event) { if (event.keyCode == 13) { $("#searchButton").click(); } });

function setMainMenuActive(menuItem) {
    $(".topmenudiv ul li").removeClass('active');
    $(".topmenudiv ul li").each(function(index) { if ($(this).text() == menuItem) { $(this).addClass("active", 1000, "easeOutBounce"); } });
}
var ready = true;
$(window).scroll(function() {
    if (ready && $(window).scrollTop() >= $(document).height() - $(window).height() - 50) { ready = false; }
    processing = false;
});

function setLoader(status) { if (status = 'active') { $(".loader").addClass('active'); } else { $(".loader").removeClass('active'); } }
$(document).ready(function() { setMainMenuActive(activePage); });
var isMobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
    console.log("mobile");
}
$(document).ready(function() {
    var bioTextHeight = $('.userBiography').height();
    if ($('.bioText').hasClass("collapsed")) {
        $('.bioText').after('<a id="bioShowMore" href="">Show More</a>');
        $('.bioText').after('<a id="bioShowLess" href="">Show Less</a>');
    }
    $("#bioShowLess").hide();
    $("#bioShowMore").click(function() {
        $("#bioShowMore").hide();
        $("#bioShowLess").show();
        $('.bioText').removeClass("collapsed");
        return false;
    });
    $("#bioShowLess").click(function() {
        $("#bioShowLess").hide();
        $("#bioShowMore").show();
        $('.bioText').addClass("collapsed");
        return false;
    });
});
$(document).ready(function() {
    $(".stories-gallery-popup").on('click', function(e) { if (!$(e.target).hasClass("stories-lightbox-area") && !$(e.target).hasClass("viewed-user")) { if (!$(e.target).parents(".stories-lightbox-area").hasClass("stories-lightbox-area") && !$(e.target).parents(".viewed-user").hasClass("viewed-user")) { $("#stroiesGalleryPopup").fadeOut(); } } });
    $(document).on('click', '.close-button-popup', function() {
        $("#stroiesGalleryPopup").stop().fadeOut();
        $("body").removeClass("modal-open");
        $(".stories-video").each(function(index, value) { $(".stories-video")[index].pause(); });
        $(".addthis-smartlayers").show();
    });
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            $("#stroiesGalleryPopup").stop().fadeOut();
            $("body").removeClass("modal-open");
            $(".stories-video").each(function(index, value) { $(".stories-video")[index].pause(); });
            $(".addthis-smartlayers").show();
        }
    });
    var oneClickStories = false;
    var storiesGallery = "";
    $(".open-stories").on('click', function() {
        var thisIndex = $(this).index();
        var activeSlidenNumber = thisIndex + 1;
        $("#stroiesGalleryPopup").stop().fadeIn(function() {
            if (!oneClickStories) {
                storiesGallery = new Swiper('#storiesLightbox', {
                    slidesPerView: 4,
                    paginationClickable: true,
                    spaceBetween: 20,
                    centeredSlides: true,
                    breakpoints: { 1400: { slidesPerView: 3, spaceBetween: 20 }, 768: { slidesPerView: 2, spaceBetween: 20, }, 420: { slidesPerView: 1, spaceBetween: 20, } },
                    onSlideChangeEnd: function(swiperHere) {
                        activeSlidenNumber = storiesGallery.activeIndex + 1;
                        var date = $("#stroiesGalleryPopup .swiper-slide:eq(" + storiesGallery.activeIndex + ")").data("date");
                        $("#stroiesGalleryPopup .viewed-user .user-info .time").html(date);
                        $("#stroiesGalleryPopup .viewed-user .action-elements .count em").html(activeSlidenNumber);
                        $(".stories-video").each(function(index, value) { $(".stories-video")[index].pause(); });
                    }
                });
                oneClickStories = true;
            }
            storiesGallery.slideTo(thisIndex);
            var totalStroies = $("#stroiesGalleryPopup .swiper-slide").length;
            var date = $("#stroiesGalleryPopup .swiper-slide:eq(" + thisIndex + ")").data("date");
            $("#stroiesGalleryPopup .viewed-user .user-info .time").html(date);
            $("#stroiesGalleryPopup .viewed-user .action-elements .count").html('<em>' + activeSlidenNumber + '</em>/' + totalStroies + '');
            setTimeout(function() { $(".stories-lightbox-area").removeClass("hidden-opacity"); if ($("#stroiesGalleryPopup .swiper-slide:eq(" + thisIndex + ") .stories-video").length > 0) { $("#stroiesGalleryPopup .swiper-slide:eq(" + thisIndex + ") .stories-video")[0].play(); } }, 350);
        });
        $(".addthis-smartlayers").hide();
    });
    if ($("#detailVideo").length > 0) { $("#detailVideo")[0].play(); }
});
$(function() {
    $(window).scroll(function() { $(window).scrollTop() > 100 ? $("#gotop").fadeIn(200) : $("#gotop").fadeOut(200) });
    $('#gotop').on('click', function() { $('html,body').animate({ scrollTop: 0 }, '200'); return false });
});