(function(a) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], a);
  } else {
    a(jQuery);
  }
}(function(a) {
  a.fn.addBack = a.fn.addBack || a.fn.andSelf;
  a.fn.extend({
    actual: function(b, l) {
      if (!this[b]) {
        throw '$.actual => The jQuery method "' + b + '" you called does not exist';
      }
      var f = {
        absolute: false,
        clone: false,
        includeMargin: false,
        display: "block"
      };
      var i = a.extend(f, l);
      var e = this.eq(0);
      var h, j;
      if (i.clone === true) {
        h = function() {
          var m = "position: absolute !important; top: -1000 !important; ";
          e = e.clone().attr("style", m).appendTo("body");
        };
        j = function() {
          e.remove();
        };
      } else {
        var g = [];
        var d = "";
        var c;
        h = function() {
          c = e.parents().addBack().filter(":hidden");
          d += "visibility: hidden !important; display: " + i.display + " !important; ";
          if (i.absolute === true) {
            d += "position: absolute !important; ";
          }
          c.each(function() {
            var m = a(this);
            var n = m.attr("style");
            g.push(n);
            m.attr("style", n ? n + ";" + d : d);
          });
        };
        j = function() {
          c.each(function(m) {
            var o = a(this);
            var n = g[m];
            if (n === undefined) {
              o.removeAttr("style");
            } else {
              o.attr("style", n);
            }
          });
        };
      }
      h();
      var k = /(outer)/.test(b) ? e[b](i.includeMargin) : e[b]();
      j();
      return k;
    }
  });
}));

$(function() {
  setup();
});

function setup() {

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  var $mainSlider = $('.content').flickity({
    // options
    cellAlign: 'left',
    contain: true,
    freeScroll: false,
    draggable: false,
    watchCSS: true,
    imagesLoaded: true,
    adaptiveHeight: false,
    selectedAttraction: 0.0185,
    friction: 0.35,
    wrapAround: true
  });

  var practiceOptions = {
    imagesLoaded: true,
    draggable: true,
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    pageDots: true
  };

  if (matchMedia('screen and (min-width: 960px)').matches) {
    practiceOptions.draggable = false;
    practiceOptions.pageDots = false;
  }


  var $practiceSlider = $('.practice__slider').flickity(practiceOptions);

  var $practiceNav = $('.practice__nav').flickity({
    imagesLoaded: true,
    wrapAround: true,
    draggable: false,
    contain: true,
    mimic: {
      target: '.practice__slider',
      indexOffset: -1
    },
    prevNextButtons: false,
    pageDots: false
  });



  $practiceNav.on('staticClick.flickity', function(event, pointer, cellElement, cellIndex) {
    if (!cellElement) {
      return;
    }

    $practiceSlider.flickity('next');

  });

  $practiceSlider.on('ready.flickity', function() {
    $practiceSlider.flickity('resize');
  });

  $practiceSlider.on('staticClick.flickity', function(event, pointer, cellElement, cellIndex) {
    // dismiss if cell was not clicked
    if (!cellElement) {
      return;
    }

    $practiceSlider.flickity('next');

  });

  $('.nav-control--prev').click(function(e) {
    e.preventDefault();
    $practiceSlider.flickity('previous');
  });
  $('.nav-control--next').click(function(e) {
    e.preventDefault();
    $practiceSlider.flickity('next');
  });


  $('.intro').click(function(e) {
    e.preventDefault();
    $('.intro').fadeOut(440);
  });

  $('.info-overlay').hide();
  $('#info__dr').hide();

  calcInfo();
  //calcConsult();
  calcContact();
  calcAddress();

  $('.info-overlay__close').click(function(e) {
    e.preventDefault();
    $('.info-overlay').hide();
    $('.header__logo').show();
    $('.base-content').fadeIn(function(e) {
      $mainSlider.flickity('resize');
    });

  });

  $('.link--overlay').click(function(e) {
    e.preventDefault();
    $('.base-content').hide();
    if ($(window).width() < 960) {
      $('.header__logo').hide();
    }
    $('.info-overlay').fadeIn(function(e) {
      $mainSlider.flickity('resize');
    });

  });


  $('.info__nav-item').click(function(e) {
    e.preventDefault();
    var infoTarget = $(this).find('a').data('showinfo');
    var $li = $(this);

    if (!$(this).find('a').hasClass('active')) {

      $li.siblings().find('a').removeClass('active');
      $li.find('a').addClass('active');
      $('.info__block--active').hide();
      $('#' + infoTarget).fadeIn();
      $('#' + infoTarget).addClass('info__block--active');
    }

  });

  $mainSlider.on('change.flickity', function(event, index) {

    if ($(event.target).hasClass('content')) {
      $('.nav-slide').removeClass('nav-slide--active');
      $("[data-target=" + index + "]").addClass('nav-slide--active');
    }

  });

  $('.nav-slide').click(function(e) {
    e.preventDefault();
    $('.nav-slide').removeClass('nav-slide--active');
    $(this).addClass('nav-slide--active');
    if ($(window).width() >= 960) {
      $mainSlider.flickity('selectCell', $(this).data('target'));
    } else {
      $(window).scrollTo('#' + $(this).data('scrollto'), 256, {
        "offset": -50
      });
    }
  });

  $(window).resize(function() {
    //calcConsult();
    calcInfo();
    calcContact();
    calcAddress();
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

}

function calcAddress() {
  if ($(window).width() >= 960) {
    var infoLogoHeight = $('.info__logo').innerHeight();
    $('.content-block.content-block--address').css('height', Math.floor(infoLogoHeight) + 'px');
  }
}

function calcInfo() {
  $('#info__dr,#info__practice').css('min-height', '0');
  var infoDrHeight = $('#info__dr').actual('height');
  var infoInfoHeight = $('#info__practice').actual('height');
  $('#info__dr,#info__practice').css('min-height', Math.max(infoDrHeight, infoInfoHeight) + 'px');
}

function calcContact() {
  if ($(window).width() >= 960) {
    $('.content-block--hours, .content-block--contact-info').css('min-height', '0');
    var contactHoursHeight = $('.content-block--hours').actual('height');
    var contactInfoHeight = $('.content-block--contact-info').actual('height');
    $('.content-block--hours, .content-block--contact-info').css('min-height', Math.max(contactHoursHeight, contactInfoHeight) + 'px');
  }
}

function calcConsult() {
  if ($(window).width() >= 960) {
    var overlayHeight = $('.info-overlay').actual('height');
    //console.log(overlayHeight);
    $('.content-block--consult').css('min-height', overlayHeight + 'px');
  } else {
    $('.content-block--consult').css('min-height', 'auto');
  }
}
