"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery', 'sortable'], 
  function ($, sortable) {
    
    $(document).ready(function() {
      
      var reorderInfo = {}
      
      var $sortable = $('.sortable')
      
    	$sortable.sortable().bind('sortupdate', function(e, ui) {
        reorderInfo.newIndex = ui.item.index()
        reorderInfo.oldIndex = ui.oldindex
        
        var rightNeighbour = $sortable.children()[ reorderInfo.newIndex + 1 ];
        //var leftNeighbour = $sortable.children()[ reorderInfo.newIndex - 1 ];
        reorderInfo.rightItemId = rightNeighbour && rightNeighbour.dataset.pageId;
        reorderInfo.movedItemId = ui.item.data('pageId');
        //reorderInfo.movedOrder = ui.item.data('pageOrder')
        //reorderInfo.rhsOrder = rightNeighbour && parseInt(rightNeighbour.dataset.pageOrder);
        //reorderInfo.lhsOrder = leftNeighbour && parseInt(leftNeighbour.dataset.pageOrder);
        
        var csrfInput = document.getElementById('csrf')
        reorderInfo['_csrf'] = csrfInput.value
        
        console.log(reorderInfo)
        
        $.ajax('/pages/reorder', {
          dataType: 'json',
          method: 'POST',
          data: reorderInfo,
          success: function(data) {
            console.log(data)
          }
        })
      })
    });
  })
});