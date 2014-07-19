"use strict";
require.config({
  shim: {
    "bootstrap": ["jquery"]
  },
  paths: {
    bootstrap: "bootstrap.min",
    jquery: "../jquery.min",
    moment: "../moment.min"
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
