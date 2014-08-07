"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery', 'rainbow'], 
  function ($, rainbow) {
    $(document).ready(function() {
    	Rainbow.color();
    });
  })
});
