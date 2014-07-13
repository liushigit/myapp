"use strict";
var paginator = function (req) {

  return function (pages, page) {
    console.log(pages, page)
    
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

    params.page = 1
    var clas = page == 1 ? "active" : ""
    str += '<li class="'+ clas +'""><a href="?'+qs.stringify(params)+'">'+ "1" +'</a></li>'
    

    if (page > 3) {
      for (var i = page - 3; i > 1; i = i - 2 ) {
        var lower = page - i
        params.page = lower
        str += '<li><a href="?'+qs.stringify(params)+'">'+ lower +'</a></li>'
      }
    }

    if (page > 2) {
      params.page = page - 1
      str += '<li><a href="?'+qs.stringify(params)+'">'+ "^" +'</a></li>'
    }

    if (page != 1 && page != pages) {
      params.page = page
      str += '<li class="active"><a href="#">'+ page +'</a></li>'
    }

    if (page < pages - 1) {
      params.page = page + 1
      str += '<li><a href="?'+qs.stringify(params)+'">'+ "v" +'</a></li>'
    }
    
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