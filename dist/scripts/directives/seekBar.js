(function () {
  // in directives the callback is a 'factory' - it returns an object that
  // describes the directive's behavior
  function seekBar($document) {

    var calculatePercent = function (seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    }

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true, // true == replace entire element, false just the contents
      restrict: 'E',
      // specify a new scope be created for the directive. this is known
      // as an 'isolate scope' and allows us to bind fcns from the directive's
      // view to its scope
      scope: { },
      // register DOM listeners and update the DOM
      link: function (scope, element, attributes) {
        scope.value = 0;
        scope.max = 100;

        var seekBar = $(element);

        var percentString = function () {
          var percent = (scope.value / scope.max) * 100;
          return percent + '%';
        };

        scope.fillStyle = function () {
          return {width: percentString()};
        };

        scope.onClickSeekBar = function (event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
        };

        scope.trackThumb = function () {
          $document.bind('mousemove.thumb', function (event) {
            var percent = calculatePercent(seekBar, event);
            // must use $apply here because this is a jQuery event
            scope.$apply(function () {
              scope.value = percent * scope.max;
            })
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        }
      }
    };
  }

  angular
  .module('blocJams')
  .directive('seekBar', ['$document', seekBar]);
})();
