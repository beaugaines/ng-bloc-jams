(function () {
  // capital case because it is a constructor
  function LandingCtrl() {
    // these $scope properties are called the 'model' in angular
    this.heroTitle = "Turn it up!";
  }

  angular
    .module('blocJams')
    // controller method takes a name, and either a callback function
    // OR an array of dependencies with callback as last item in array
    .controller('LandingCtrl', LandingCtrl)
})();
