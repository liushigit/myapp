"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery', 'sortable'], 
  function ($, sortable) {
    $(document).ready(function() {
    	$('.sortable').sortable()
    });
  })
});