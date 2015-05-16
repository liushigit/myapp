"use strict";
var paginator = function (req) {

  return function (pages, page) {
//    console.log(pages, page)
    
    var url = require('url')
      , qs = require('querystring')
      , params = qs.parse(url.parse(req.url).query)
      , str = '';

    pages = Math.ceil(pages);

    if (typeof page === 'string' ) {
      page = parseInt(page);
      if (isNaN(page)) {
        throw {
          name: 'TypeError',
          message: 'paginator: bad page value'
        }
      }
    }
    
    // Add link for the first page
    params.page = 1
    var clas = page == 1 ? "active" : ""
    str += '<li class="'+ clas +'""><a href="?'+qs.stringify(params)+'">'+ "1" +'</a></li>'

  	// If the current page# > 3, add links for every 2 pages, from page 3 to page#-2
    if (page > 3) {
//      for (var i = page - 3; i > 1; i = i - 2 ) {
//        var lower = page - i
//        params.page = lower
//        str += '<li><a href="?'+qs.stringify(params)+'">'+ lower +'</a></li>'
//      }
      var i = 3
      for (; i <= page - 2; i += 2 ) {
        params.page = i
         str += '<li><a href="?'+qs.stringify(params)+'">'+ i +'</a></li>'
      }
    }
    
    // add the link for the previous page
    if (page > 2) {
      params.page = page - 1
      str += '<li><a href="?'+qs.stringify(params)+'">'+ "^" +'</a></li>'
    }

    // add the link for current page
    if (page != 1 && page != pages) {
      params.page = page
      str += '<li class="active"><a href="#">'+ page +'</a></li>'
    }

    // add the link for the next page, if it's not the last one
    if (page < pages - 1) {
      params.page = page + 1
      str += '<li><a href="?'+qs.stringify(params)+'">'+ "v" +'</a></li>'
    }
    
    // add the link for the links between above ones and the last, every 3 pages.
    if (page < pages - 3) {
      
      for (var i = 1; i < (pages-page) / 3; i++) {
        var advanced = (page + i * 3)
        
        params.page = advanced
        str += '<li><a href="?'+qs.stringify(params)+'">'+ advanced +'</a></li>'
      }
    }

    params.page = pages
    clas = page == pages ? "active" : ""
    str += '<li class="'+ clas +'""><a href="?'+qs.stringify(params)+'">'+ ";" +'</a></li>'

    return str
  }
}

module.exports = {
  'paginator': paginator
}