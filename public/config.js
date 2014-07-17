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
function ($, bootstrap, moment) {
    $('time').each(function (index, el) {
    	el.innerHTML = moment(el.getAttribute('datetime')).fromNow();
    });
});

requirejs(['jquery'], 
function ($) {
  var added_tags = [];

  var add_tags = function (e) {
    var input_elm = $('#tags')[0]
      , tag_box_sel = '#tags_box'
      , form_sel = '#blog_post_form'
      , inputs = input_elm.value.split(/[,;]/);

    input_elm.value = '';

    var i, word;
    for(i=0; i != inputs.length; i++) {
      word = inputs[i];
      word = word.replace(/^\s+|\s+$/g, '')
      console.log(added_tags)
      if (added_tags.indexOf(word) === -1 && word !=='') {
        console.log('added: ', word)
        added_tags.push(word);

        $('<li>').addClass('label label-info')
                   .html(word+' ')
                   .css('display', 'none')
                   .append('<button type="button">&times;</button>')
                   .appendTo(tag_box_sel)
                   .fadeIn();

        $('<input>').attr({
          'type': 'hidden'
         ,'name': 'blog[tags]'
         ,'value': word
        }).appendTo(form_sel);
      }
    }


  }
  $('#add_tags_btn').click(add_tags);
});




