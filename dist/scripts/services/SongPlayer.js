(function () {
  function SongPlayer(Fixtures) {
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
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
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

      SongPlayer.currentSong = song;
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
    *  @function play
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
    };

    /**
    *  @function pause
    *  @desc Public interface to pause play of currentBuzzObject and set song.playing to false
    * @param (Object) song
    **/
    SongPlayer.pause = function (song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

    /**
    *  @function previous
    *  @desc Public interface to skip back to the previous song in current album
    **/
    SongPlayer.previous = function () {
      var currentIndex = getSongIndex(SongPlayer.currentSong);
      currentIndex--;
      if (currentIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        SongPlayer.play(currentAlbum.songs[currentIndex]);
      }
    }

    /**
    *  @function next
    *  @desc Public interface to skip ahead to the next song in current album
    **/
    SongPlayer.next = function () {
      var currentIndex = getSongIndex(SongPlayer.currentSong);
      var nextIndex = (currentIndex + 1) % currentAlbum.songs.length;
      SongPlayer.play(currentAlbum.songs[nextIndex]);
    }

    return SongPlayer;
  }

  angular
  .module('blocJams')
  .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();
