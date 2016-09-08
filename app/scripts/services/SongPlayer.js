(function () {
  function SongPlayer() {
    /**
    * @desc SongPlayer object
    * @type (Object)
    **/
    var SongPlayer = {};

    /**
    * @desc currentSong attribute
    * @type (Object)
    **/
    var currentSong = null;

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
        currentBuzzObject.stop();
        currentSong.playing = null;
      }

      /**
      * @desc local instance of buzz sound library
      * @type (Object)
      * @param (String, Object) song audio url, config object
      **/
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
    }

    /**
    *  @function playSong
    *  @desc Plays the currentBuzzObject song and sets the playing property of the song to true
    **/

    var playSong = function () {
      currentBuzzObject.play();
      currentSong.playing = true;
    }


    /**
    *  @function play
    *  @desc Public interface to setSong and playSong methods
    * @param (Object) song
    **/
    SongPlayer.play = function (song) {
      if (currentSong !== song) {
        setSong(song);
        playSong();
      } else if (currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong();
        }
      }
    };

    /**
    *  @function pause
    *  @desc Public interface to pause play of currentBuzzObject and set song.playing to false
    * @param (Object) song
    **/
    SongPlayer.pause = function (song) {
      currentBuzzObject.pause();
      song.playing = false;
    }

    return SongPlayer;
  }

  angular
  .module('blocJams')
  .factory('SongPlayer', SongPlayer);
})();
