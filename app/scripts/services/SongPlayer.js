(function () {
  function SongPlayer($rootScope, Fixtures) {
    /**
    * @desc SongPlayer object
    * @type (Object)
    **/
    var SongPlayer = {};

    /**
    * @desc Currently playing album
    * @type (Object)
    **/
    var currentAlbum = Fixtures.getAlbum();

    /**
    *  @desc Buzz object audio file
    *  @type (Object)
    **/

    var currentBuzzObject = null;

    /**
    *  @function setSong
    *  @desc Stops currently playing song and loads new audio file as currentBuzzObject
    *  @param (Object) song
    **/
    var setSong = function (song) {
      if (currentBuzzObject) {
        stopSong();
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function () {
        $rootScope.$apply(function () {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
      SongPlayer.currentAlbum = currentAlbum;

      currentBuzzObject.bind('ended', function () {
        SongPlayer.next();
      });
    }

    /**
    *  @function playSong
    *  @desc Plays the currentBuzzObject song and sets the playing property of the song to true
    **/
    var playSong = function () {
      currentBuzzObject.play();
      SongPlayer.currentSong.playing = true;
    }

    /**
    *  @function stopSong
    *  @desc Stops the currentBuzzObject song and sets playing property of the song to null
    * @param (Object) song
    **/
    var stopSong = function () {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
    }

    /**
    *  @function getSongIndex
    *  @desc Get the index of a given song
    *  @param (Object) song
    **/
    var getSongIndex = function (song) {
      return currentAlbum.songs.indexOf(song);
    }



    /**
    * @desc SongPlayer.currentSong attribute
    * @type (Object)
    **/
    SongPlayer.currentSong = null;

    /**
    * @desc SongPlayer.currentTime attribute
    * @type (Number)
    **/
    SongPlayer.currentTime = null

    /**
    * @desc SongPlayer.currentVolume attribute
    * @type (Number)
    **/
    SongPlayer.currentVolume = null


    /**
    *  @function SongPlayer.play
    *  @desc Public interface to setSong and playSong methods
    * @param (Object) song
    **/
    SongPlayer.play = function (song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong();
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong();
        }
      }
    }

    /**
    *  @function SongPlayer.pause
    *  @desc Public interface to pause play of currentBuzzObject and set song.playing to false
    * @param (Object) song
    **/
    SongPlayer.pause = function (song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

    /**
    *  @function SongPlayer.previous
    *  @desc Public interface to skip back to the previous song in current album
    **/
    SongPlayer.previous = function () {
      var currentIndex = getSongIndex(SongPlayer.currentSong);
      currentIndex--;
      if (currentIndex < 0) {
        stopSong();
      } else {
        SongPlayer.play(currentAlbum.songs[currentIndex]);
      }
    }

    /**
    *  @function SongPlayer.next
    *  @desc Public interface to skip ahead to the next song in current album
    **/
    SongPlayer.next = function () {
      var currentIndex = getSongIndex(SongPlayer.currentSong);
      var nextIndex = (currentIndex + 1) % currentAlbum.songs.length;
      SongPlayer.play(currentAlbum.songs[nextIndex]);
    }

    /**
    *  @function SongPlayer.setCurrentTime
    *  @desc Public interface to set currentTime from seekBar manipulation
    **/
    SongPlayer.setCurrentTime = function (time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    }


    /**
    *  @function SongPlayer.setCurrentVolume
    *  @desc Public interface to set currentVolume from seekBar manipulation
    **/
    SongPlayer.setCurrentVolume = function (value) {
      if (currentBuzzObject) {
        SongPlayer.currentVolume = currentBuzzObject.setVolume(value).getVolume();
      }
    }

    /**
    *  @function SongPlayer.toggleMute
    *  @desc Public interface to toggle sound
    **/
    SongPlayer.toggleMute = function () {
      if (currentBuzzObject) {
        currentBuzzObject.toggleMute();
      }
    }
    return SongPlayer;
  }

  angular
  .module('blocJams')
  .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
