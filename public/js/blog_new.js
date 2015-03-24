"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery'], 
  function ($) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '')
    };
    var FORM_SELECTOR = '#blog_post_form'
      , TAG_BOX_SELECTOR = '#tags_box'
      , TAG_INPUT_SELECTOR = 'input[name="blog[tags]"]' // input elems in the form
      , added_tags = []
      , set_added_tags = function () {
          $(TAG_INPUT_SELECTOR).each(function (idx, elm) {
            added_tags.push(elm.value);
            // console.log(added_tags);
          });
        }

      , add_tags = function (e) {
          var input_elm = $('#tags')[0]
            , inputs = input_elm.value.split(/[,;]/);

          input_elm.value = '';

          var i, word;
          for(i=0; i != inputs.length; i++) {
            word = inputs[i];
            word = word.trim() //word.replace(/^\s+|\s+$/g, '')
            console.log(added_tags)
            if (added_tags.indexOf(word) === -1 && word !=='') {
              // console.log('added: ', word)
              added_tags.push(word);

              $('<span>').addClass('label label-info')
                         .html(word)
                         .css('display', 'none')
                         .append('<button type="button">&times;</button>')
                         .appendTo(TAG_BOX_SELECTOR)
                         .fadeIn();

              $('<input>').attr(
                {
                  'type': 'hidden'
                 ,'data-new': 'true'
                 ,'name': 'blog[tags]'
                 ,'value': word
                }
              ).appendTo(FORM_SELECTOR);
            }
          }
        }
      
      , del_tags = function (e) {
          var $button = $(e.target),
              $parent = $button.parent(),
              tag_word = $parent[0].firstChild.nodeValue.trim(),
              $tag_inputs = $('input[value="' + tag_word +'"]')
                            .filter('input[name="blog[tags]"]'),
              $new_tag_inputs = $tag_inputs.filter('input[data-new]');
          
          $tag_inputs.remove();

          var indexOfWord = added_tags.indexOf(tag_word)
          if ( indexOfWord !== -1) {
            delete added_tags[indexOfWord]
          }

          if (! $new_tag_inputs.length) {
            $('<input name=tags[toRemove] type=hidden value="' + tag_word +'"/>')
            .appendTo(FORM_SELECTOR);
          }
          $parent.fadeOut(800, function () {
            $(this).remove();
          });
        }

    $(document).ready(set_added_tags);
    $('#add_tags_btn').click(add_tags);
    $('#tags_box').on('click', 'button', del_tags);
    
  });
});
