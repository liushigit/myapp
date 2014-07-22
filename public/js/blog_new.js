"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery'], 
  function ($) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '')
    };
    var form_sel = '#blog_post_form'
      , tag_box_sel = '#tags_box'
      , tag_input_sel = 'input[name="blog[tags]"]' // input elems in the form
      , added_tags = []
      , set_added_tags = function () {
          $(tag_input_sel).each(function (idx, elm) {
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
                         .appendTo(tag_box_sel)
                         .fadeIn();

              $('<input>').attr(
                {
                  'type': 'hidden'
                 ,'data-new': 'true'
                 ,'name': 'blog[tags]'
                 ,'value': word
                }
              ).appendTo(form_sel);
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
          if (! $new_tag_inputs.length) {
            $('<input name=tags[toRemove] type=hidden value="' + tag_word +'"/>')
            .appendTo(form_sel);
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
