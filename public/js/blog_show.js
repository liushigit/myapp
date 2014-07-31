"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery', 'highlight'], 
  function ($, hlt) {
    $(document).ready(function() {
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    });
  })
});
