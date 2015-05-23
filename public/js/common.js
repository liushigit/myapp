"use strict";
require.config({
  shim: {
    "bootstrap": ["jquery"],
    "highlight": [],
    'rainbow': []
  },
  paths: {
    bootstrap: "bootstrap.min",
    jquery: "../jquery.min",
    moment: "../moment.min",
    highlight: "lib/hlt",
    rainbow: 'lib/rainbow-custom.min',
    sortable: '../html.sortable/dist/html.sortable.min'
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
