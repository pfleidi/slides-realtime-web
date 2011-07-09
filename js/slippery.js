/*!
 * slippery.js
 * A JavaScript presentation software
 */

(function ($, window, undefined) {
    var History = window.history;

    function getSlideNumber() {
      return window.location.hash ? parseInt(window.location.hash.split('#slide')[1], 10) : 1;
    }

    function init() {
      var firstFrame = getSlideNumber();
      var title = $('title').text();

      var slides = $('#boxwrapper > section');

      slides.each(function (index) {
          index += 1;
          var method = (index === 1 ? 'replace' : 'push') + 'State';
          History[method](index, title + ' (' + index + '/' + slides.length + ')', '#slide' + index);
        });

      $('<footer>').attr('id', 'footer').append(
        $('<div class="flex-wrapper">' +
            '<p id="index">' + title + ' ' +
            '<span class="pagenumber"></span> / ' + slides.length + 
            '</p>')
        ).appendTo('body');


        window.addEventListener('popstate', function (event) { 
            if (event.state) {
              var state = event.state;

              var current = $('section.current');
              var previous = $('section.previous');
              var next = $('section:nth-child(' + state + ')');

              if (previous) {
                previous.removeClass('previous');
              }

              if (current) {
                current.removeClass('current');
                current.addClass('previous');
              }

              if (next) {
                var newNext = $('section:nth-child(' + (state + 1) + ')');
                newNext.addClass('next');
                next.removeClass('next');
                next.addClass('current');
              }

              $('#index .pagenumber').text(state);
            }
          }, true); 

        History.go(- slides.length + firstFrame);
      }

      $(document).ready(function () {
          init();
          prettyPrint();

          $(window).keydown(function (e) {

              // Don't intercept keyboard shortcuts
              if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
              }

              if (
                e.keyCode === 37 // left arrow
              ) {
                e.preventDefault();
                var currentSlide = getSlideNumber();
                if (currentSlide > 1) { 
                  History.back();
                }
              }

              if (
                e.keyCode === 39 // right arrow
              ) {
                e.preventDefault();
                History.forward();
              }
            });

        });


    }(jQuery, window));
