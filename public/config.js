"use strict";
require.config({
  shim: {

  },
  paths: {
    bootstrap: "js/bootstrap.min",
    jquery: "jquery.min",
    moment: "moment.min"
  },
  packages: [

  ]
});

requirejs(['jquery', 'bootstrap', 'moment'],
function   ($, bootstrap, moment) {
    $('time').each(function (index, el) {
    	el.innerHTML = moment(el.getAttribute('datetime')).fromNow();
    });
});