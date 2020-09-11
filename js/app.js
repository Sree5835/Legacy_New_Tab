
//todolist
(function() {

  var list = document.querySelector('#todo-list'),
    form = document.querySelector('#todo-form'),
    item = document.querySelector('#todo-input');

  form.addEventListener('submit', function(e) {
    if (item.value.length != 0 && item.value != " ") {
      e.preventDefault();
      list.innerHTML += '<li class="todo-item">' + item.value + '</li>';
      store();
      item.value = "";
    }
  }, false)

  list.addEventListener('click', function(e) {
    var t = e.target;
    if (t.classList.contains('checked')) {
      t.parentNode.removeChild(t);
    } else {
      t.classList.add('checked');
    }
    store();
  }, false)
  getValues();

  function store() {
    window.localStorage.myitems = list.innerHTML;
  }

  function getValues() {
    var storedValues = window.localStorage.myitems;
    if (!storedValues) {
      list.innerHTML = '<li class="todo-item">Hooray! You have nothing on your list!</li>';
    } else {
      list.innerHTML = storedValues;
    }
  }

})();




//user info
(function() {

  var displayedName = document.getElementById("displayedName"),
    form = document.querySelector('#user-form'),
    name = document.querySelector('#username-input');

  form.addEventListener('submit', function(e) {
    if (name.value.length != 0 && name.value != " ") {
      e.preventDefault();
      console.log(name.value);
      window.localStorage.setItem("username", name.value);
      displayedName.innerHTML = "Hello " + name.value;
      name.placeholder = "Name: " + name.value;
      // if (name.value == "Bday #") {
      //   window.location.replace('dashboard.html');
      // }
      name.value = "";
    }
  }, false)
})();

// (function() {
//   form = document.querySelector('#bg-form'),
//     bg_type = document.querySelector('#bg-input')
//
//   form.addEventListener('submit', function(e) {
//     if (bg_type.value.length != 0 && bg_type.value != " ") {
//       e.preventDefault();
//       console.log(bg_type.value);
//       window.localStorage.setItem("bg_type", bg_type.value);
//       bg_type.placeholder = "Background Type: " + bg_type.value;
//       bg_type.value = "";
//     }
//   }, false)
// })();



// Standard Google Universal Analytics code

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {

    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),

    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)

})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', '<ANALYTICS GIVEN NUMBER>', 'auto');

ga('set', 'checkProtocolTask', function() {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200

ga('require', 'displayfeatures');

ga('send', 'pageview', '/dashboard.html');

document.addEventListener('DOMContentLoaded', function() {
  //for id=add console.log("Todo-list was clicked");
  document.getElementById('reminder-circle').onclick = function() {
    sendToAnalytics("Todo-list");
  }
  //for id=music_note
  document.getElementById('music_note').onclick = function() {
    sendToAnalytics("Music_note");
    swal("Integration", "Coming soon...", "warning");
    // $('#notification-heading').html('<span>' + "Integration" + ' </span>').show(0);
    // $('#notification-content').html('<span>' + "Coming soon..." + ' </span>').show(0);
    // location.replace('dashboard.html#notification');
  }
  //for id=map
  document.getElementById('map').onclick = function() {
    sendToAnalytics("Map");
    window.open("https://www.google.com/maps", "_self");
  }
  //for id=expand_less
  document.getElementById('expand_less').onclick = function() {
    sendToAnalytics("Expand");
  }
  //for id=settings
  document.getElementById('settings').onclick = function() {
    sendToAnalytics("Settings");

  }
});

function sendToAnalytics(x){
  ga('send', {
    hitType: 'event',
    eventCategory: 'Icons',
    eventAction: x,
    eventLabel: x
  });
}



//settings modal stuff

document.addEventListener('DOMContentLoaded', function() {
  var temperature_toggle = document.getElementById('temperature-toggle');
  if (localStorage.getItem("temp_type") == "Fahrenheit") {
    temperature_toggle.classList.add("active");
  } else {
    temperature_toggle.classList.remove("active");
  }


  var time_toggle = document.getElementById('time-toggle');
  if (localStorage.getItem("time_type") == "12-hr") {
    time_toggle.classList.add("active");
  } else {
    time_toggle.classList.remove("active");
  }

  var view_bg_img = document.getElementById('view-image-toggle');
  view_bg_img.addEventListener("click", function() {
    if (!view_bg_img.classList.contains("active")) {
      console.log("view bg img");
      $('#main-container').css("display", "none");
      $('#main-wrapper').css("display", "none");
      if (localStorage.getItem("hide_searchbar") == "no") {
        $('#search-bar').css("display", "none");
      }
    } else {
      console.log("stop view bg img");
      $('#main-container').css("display", "block");
      $('#main-wrapper').css("display", "block");
      if (localStorage.getItem("hide_searchbar") == "no") {
        $('#search-bar').css("display", "block");
      }
    }
  });

  var keep_bg_img = document.getElementById('keep-image-toggle');
  if (localStorage.getItem("keep_bg") == "yes") {
    keep_bg_img.classList.add("active");
  } else {
    keep_bg_img.classList.remove("active");
  }
  keep_bg_img.addEventListener("click", function() {
    if (!keep_bg_img.classList.contains("active")) {
      console.log("keep bg img");
      window.localStorage.setItem("keep_bg", "yes");
    } else {
      console.log("stop keep bg img");
      window.localStorage.setItem("keep_bg", "no");
    }
  });

  var hide_searchbar = document.getElementById('hide-searchbar-toggle');
  if (localStorage.getItem("hide_searchbar") == "yes") {
    $('#search-bar').css("display", "none");
    hide_searchbar.classList.add("active");
  } else {
    $('#search-bar').css("display", "block");
    hide_searchbar.classList.remove("active");
  }
  hide_searchbar.addEventListener("click", function() {
    if (!hide_searchbar.classList.contains("active")) {
      console.log("hide searchbar");
      window.localStorage.setItem("hide_searchbar", "yes");
      $('#search-bar').css("display", "none");
    } else {
      console.log("no hide searchbar");
      window.localStorage.setItem("hide_searchbar", "no");
      $('#search-bar').css("display", "block");
    }
  });

  var contrast_infobar = document.getElementById('contrast-info-bar-toggle');
  if (localStorage.getItem("contrast_infobar") == "no") {
    $('#welcome-box.col-md-12').css("border-bottom", "1px solid #eee");
    $('#welcome-box.col-md-12').css("background", "");
    $('#welcome-box.col-md-12').css("border-radius", "");
    contrast_infobar.classList.remove("active");
  } else {
    $('#welcome-box.col-md-12').css("background", "rgba(100, 100, 100, 0.45)");
    $('#welcome-box.col-md-12').css("border-radius", "20px");
    $('#welcome-box.col-md-12').css("border-bottom", "");
    contrast_infobar.classList.add("active");
  }
  contrast_infobar.addEventListener("click", function() {
    if (!contrast_infobar.classList.contains("active")) {
      console.log("contrast");
      $('#welcome-box.col-md-12').css("background", "rgba(100, 100, 100, 0.45)");
      $('#welcome-box.col-md-12').css("border-radius", "20px");
      $('#welcome-box.col-md-12').css("border-bottom", "");
      window.localStorage.setItem("contrast_infobar", "yes");
    } else {
      console.log("normal");
      $('#welcome-box.col-md-12').css("border-bottom", "1px solid #eee");
      $('#welcome-box.col-md-12').css("background", "");
      $('#welcome-box.col-md-12').css("border-radius", "");
      window.localStorage.setItem("contrast_infobar", "no");
    }
  }); // dont use contrast infobar as an example later on, it is bad, choose the one above it





  //settings options functions


  displayBlock($('#general-settings'));

  document.getElementById('general-button').addEventListener("click", function() {
    displayBlock($('#general-settings'));
  });
  document.getElementById('background-button').addEventListener("click", function() {
    displayBlock($('#background-settings'));
  });
  document.getElementById('challenges-button').addEventListener("click", function() {
    displayBlock($('#challenges-settings'));
  });
  document.getElementById('contributors-button').addEventListener("click", function() {
    displayBlock($('#contributors-settings'));
  });
  document.getElementById('idea-box-button').addEventListener("click", function() {
    displayBlock($('#idea-box-settings'));
  });
  document.getElementById('donate-button').addEventListener("click", function() {
    displayBlock($('#donate-settings'));
  });
  document.getElementById('contact-us-button').addEventListener("click", function() {
    displayBlock($('#contact-us-settings'));
  });
  document.getElementById('about-us-button').addEventListener("click", function() {
    displayBlock($('#about-us-settings'));
  });

  function displayBlock(x) {
    $('#general-settings').css("display", "none");
    $('#background-settings').css("display", "none");
    $('#challenges-settings').css("display", "none");
    $('#contributors-settings').css("display", "none");
    $('#idea-box-settings').css("display", "none");
    $('#donate-settings').css("display", "none");
    $('#contact-us-settings').css("display", "none");
    $('#about-us-settings').css("display", "none");
    x.css("display", "block");
  };

});
//end of settings modal stuff
