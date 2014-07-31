"use strict";
require.config({
  shim: {
    "bootstrap": ["jquery"],
    "highlight": []
  },
  paths: {
    bootstrap: "bootstrap.min",
    jquery: "../jquery.min",
    moment: "../moment.min",
    highlight: "lib/hlt"
  },
  packages: [

  ]
});


requirejs(['jquery', 'bootstrap', 'moment'],
function ($, bootstrap, moment) {
    $('time').each(function (index, el) {
    	el.innerHTML = moment(el.getAttribute('datetime')).fromNow();
    });
});
