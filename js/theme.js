var obj = {};
var warning = ["Tornado", "Tropical Storm", "Hurricane", "Not Available"];
var storm = ["Dust", "Thunderstorms", "Thundershowers", "Isolated Thunderstorms", "Isolated Thundershowers", "Scattered Thunderstorms", "Severe Thunderstorms"];
var clouds = ["Cloudy", "Mostly Cloudy", "Partly Cloudy", "Breezy", "Foggy", "Windy", "Haze", "Smoky", "Blustery"];
var rain = ["Rain", "Showers", "Scattered Showers", "Freezing Rain", "Rain And Snow", "Mixed Rain And Snow", "Mixed Rain And Sleet", "Hail", "Mixed Rain And Hail"];
var drizzle = ["Drizzle", "Freezing Drizzle"];
var sun = ["Clear", "Sunny", "Fair", "Hot"];
var snow = ["Snow", "Snow Showers", "Cold", "Scattered Snow Showers", "Light Snow Showers", "Snow Flurries", "Heavy Snow", "Blowing Snow", "Mixed Snow And Sleet", "Sleet"];
var temperature_toggle = document.getElementById('temperature-toggle');
var time_toggle = document.getElementById('time-toggle');
var dt = new Date();
var bgDelay = parseInt(localStorage.getItem("bgDelay"));
var reloadedBool = ((localStorage.getItem("keep_bg") == "yes") || (Math.abs(parseInt(localStorage.getItem("lastReloaded"))-dt.getMinutes())< bgDelay));
var isOnline = navigator.onLine;

$(document).ready(function() {
  if (isOnline) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var myLatitude = position.coords.latitude.toString();
        var myLongitude = position.coords.longitude.toString();
        var oauth = {
          'oauth_consumer_key': '<INSERT CONSUMER KEY>'',
          'oauth_nonce': Math.random().toString(36).substring(2),
          'oauth_signature_method': 'HMAC-SHA1',
          'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
          'oauth_version': '1.0'
        };

        var merged = {};
        $.extend(merged, {
          'lat': myLatitude,
          'lon': myLongitude,
          'format': 'json'
        }, oauth);
        // Note the sorting here is required
        var merged_arr = Object.keys(merged).sort().map(function(k) {
          return [k + '=' + encodeURIComponent(merged[k])];
        });
        //console.log(merged_arr)
        var signature_base_str = 'GET&' + encodeURIComponent('https://weather-ydn-yql.media.yahoo.com/forecastrss') +
          "&" + encodeURIComponent(merged_arr.join("&"));
        var hash = CryptoJS.HmacSHA1(signature_base_str,
          "<STRING>");
        var signature = hash.toString(CryptoJS.enc.Base64);
        oauth['oauth_signature'] = signature;
        var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
          return [k + '="' + oauth[k] + '"'];
        }).join(',');

        $.ajax({
          url: 'https://weather-ydn-yql.media.yahoo.com/forecastrss' + '?' + $.param({
            'lat': myLatitude,
            'lon': myLongitude,
            'format': 'json'
          }),
          headers: {
            'Authorization': auth_header,
            'X-Yahoo-App-Id': '<APP ID>'
          },
          method: 'GET',
          success: function(data) {
            var kTemp = Math.round(((data.current_observation.condition.temperature - 32) * (5 / 9)) + 273.15)
            obj = {
              weatherStatus: data.current_observation.condition.text,
              kelvinTemp: kTemp,
              weatherImg: data.current_observation.condition.text,
              weatherTemp: (kTemp - 273),
              weatherSunRise: sunTime(data.current_observation.astronomy.sunrise),
              weatherSunSet: sunTime(data.current_observation.astronomy.sunset),
              city: data.location.city,
            };
            //console.log(obj);
            localStorage.setItem('user', JSON.stringify(obj));
            if (localStorage.getItem("firstRun") != "no") {
              loadFirstData();
            //  console.log("loadFirstData");
              localStorage.setItem("firstRun", "no")
            }
          }
        });
      });
    } else {
      $("#city").html("Please turn on Geolocator on Browser.")
    }
  }
});

isOnLine();

async function isOnLine() {
  if (isOnline) {
    if (reloadedBool) {
      loadURI();
    } else {
      var img = new Image();
      img.setAttribute('crossorigin', '');
      var background = document.querySelector('#background');
      var type = "?water,forest,scenery,space,trees,life,plants,nature,animals,birds,colorful,fall" + window.localStorage.getItem("bg_type");
      var link = "https://source.unsplash.com/1600x900/" + type;
      img.src = link;
      img.onload = function() {
        convertImageToDataURI(img).then(function(data) {
            localStorage.setItem('URI', data);
        });
      };
      var url = 'url(' + link + ') no-repeat center center fixed';
      $('body').css('background', url);
      localStorage.setItem("lastReloaded",dt.getMinutes());
    }
  } else {
    loadURI();
  };
  loadSavedData();
}

async function convertImageToDataURI(img) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png')
};

async function loadURI() {
  var URIlink = localStorage.getItem("URI");
  if (URIlink == null || URIlink == "[object Promise]" || URIlink == "") {
    var link = "/img/sampleImg.jpg"
  } else {
    var link = URIlink
  }
  var url = 'url(' + link + ') no-repeat center center fixed';
  $('body').css('background', url)
};


if (window.localStorage.getItem("username") == null) {
  var username = "My Friend"
} else {
  var username = window.localStorage.getItem("username")
}
var name = document.querySelector('#username-input');
var nhour = dt.getHours(),
  ap;
if (0 <= nhour && nhour < 12) {
  ap = " Good Morning, "
} else if (nhour >= 12 && nhour < 17) {
  ap = " Good Afternoon, "
} else if (17 <= nhour && nhour < 20) {
  ap = " Good Evening, "
} else if (nhour >= 20) {
  ap = " Good Night, "
}
$('#displayedName').html(ap + username);
name.placeholder = "Name: " + username;
document.querySelector('input.bgDelay').value = bgDelay;

$(document).ready(function() {
  GetClock();
  setInterval(GetClock, 20000);
  $(".wrapper").css("margin-top", ($(window).height()) / 5);
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $('#day').html(days[dt.getDay()]);
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  $('#date').html(months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear());
});

async function tempChanger(x, y, z, math, type, s) {
  $(x).css("color", "#eee");
  $(y).css("display", "none");
  $(z).css("display", "block");
  if(math==0){
    //console.log(JSON.parse(localStorage.getItem('user')).weatherTemp);
    if(x == "#celsius"){
      $('#temperature').html(Math.round(JSON.parse(localStorage.getItem('user')).weatherTemp));
    }else{
      $('#temperature').html(Math.round(Math.round(JSON.parse(localStorage.getItem('user')).weatherTemp * 1.8 + 32)));
    }
  }else{
    $('#temperature').html(math);
  }
  if(type!="none"){
  window.localStorage.setItem("temp_type", type);
  }
  if (s == "r") {
    temperature_toggle.classList.remove("active");
  } else if (s == "a") {
    temperature_toggle.classList.add("active");
  }
}
async function timeChanger(x, y, type, clock, html, s, c) {
  $('#time-12').css("display", x);
  $('#time-24').css("display", y);
  if (type != "") {
    window.localStorage.setItem("time_type", type);
  }
  if (clock != "" && html != "") {
    $(clock).html(html);
  }
  if (s == "r") {
    time_toggle.classList.remove("active");
  } else if (s == "a") {
    time_toggle.classList.add("active");
  }
  if (c == "yes") {
    GetClock(false);
  } else {
    GetClock(true);
  }
}

async function GetClock(x) {
  var d = new Date();
  var nhour = d.getHours(),
    nmin = d.getMinutes(),
    ap;
  if (localStorage.getItem("time_type") == "12-hr") {
    if (nhour == 0) {
      ap = " AM";
      nhour = 12
    } else if (nhour < 12) {
      ap = " AM"
    } else if (nhour == 12) {
      ap = " PM"
    } else if (nhour > 12) {
      ap = " PM";
      nhour -= 12
    }
    if (nmin <= 9) nmin = "0" + nmin;
    if (x != true) {
      timeChanger("block", "none", "", "#time-12", "" + nhour + ":" + nmin + ap + "", "r", "no");
    }
  }
  if (localStorage.getItem("time_type") == "24-hr") {
    if (nmin <= 9) nmin = "0" + nmin
    if (x != true) {
      timeChanger("none", "block", "", "#time-24", "" + nhour + ":" + nmin + "", "a", "no");
    }
  };
};
async function weatherIcon(img_type) {
  if (snow.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/snow.png")
  }
  if (drizzle.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/drizzle.png")
  }
  if (rain.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/rain.png")
  }
  if (clouds.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/cloudy.png")
  }
  if (sun.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/sunny2.png")
  }
  if (storm.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/thunderstorm.png")
  }
  if (warning.indexOf(img_type) > -1) {
    $('.weather-icon').attr("src", "/img/weather/warning.png")
  }
}

async function loadSavedData() {
  //console.log("loading saved data");
  var user = JSON.parse(localStorage.getItem('user'));
  //console.log("the saved user item: ");
  //console.log(JSON.parse(localStorage.getItem('user')));
  $('#city').html(user.city);
  $('#weather-status').html(user.weatherStatus);
  var img_type = user.weatherImg;
  weatherIcon(img_type);
  var temp_type = localStorage.getItem("temp_type");
  if (temp_type == "Fahrenheit") {
    tempChanger("#fahrenheit", '#celsius', '#fahrenheit', Math.round(user.weatherTemp * 1.8 + 32), "none", "none");
  }
  if (temp_type == "Celsius") {
    tempChanger("#celsius", '#fahrenheit', '#celsius', Math.round(user.weatherTemp), "none", "none");
  }
  $('.sunrise-time').html(user.weatherSunRise);
  $('.sunset-time').html(user.weatherSunSet);
  if(!isOnline){
  $('#text').text(localStorage.getItem("quote"));
  }
}

function sunTime(str) {
  if (str.charAt(str.indexOf(":") + 2) == " ") {
    var str1 = str.substring(0, str.indexOf(":") + 1);
    var str2 = str.substring(str.indexOf(":") + 1);
    str = str1 + "0" + str2;
  }
  return str;
}

async function loadFirstData() {
  //console.log("loading data first time");
  //console.log(obj);
  $('#city').html(obj.city);
  $('#weather-status').html(obj.weatherStatus);
  var img_type = obj.weatherImg;
  weatherIcon(img_type);
  var temp_type = localStorage.getItem("temp_type");
  if (temp_type == "Fahrenheit") {
    tempChanger("#fahrenheit", '#celsius', '#fahrenheit', Math.round(obj.weatherTemp * 1.8 + 32), "none", "none");
  }
  if (temp_type == "Celsius") {
    tempChanger("#celsius", '#fahrenheit', '#celsius', Math.round(obj.weatherTemp), "none", "none");
  }
  $('.sunrise-time').html(obj.weatherSunRise);
  $('.sunset-time').html(obj.weatherSunSet);

};
versionChecker()

async function versionChecker() {
  var details = chrome.app.getDetails();
  currVersion = details.version;
  var prevVersion = localStorage.version
  if (currVersion != prevVersion) {
    if (typeof prevVersion == 'undefined' && localStorage.getItem('firstRun') == null) {
      //console.log("Extension Installed");
      window.localStorage.setItem("firstRun", "yes");
      window.localStorage.setItem("temp_type", "Fahrenheit");
      window.localStorage.setItem("time_type", "12-hr");
      window.localStorage.setItem("hide_searchbar", "no");
      window.localStorage.setItem("contrast_infobar", "yes");
      window.localStorage.setItem("newUpdate", "no");
      window.localStorage.setItem("keep_bg", "no");
      window.localStorage.setItem("bgDelay",1);
      swal("Welcome to LNT!", "Thank you for installing Legacy New Tab! Start off by typing your name below.", {
        content: "input",
      }).then((name) => {
        //console.log(name);
        swal("You're all set!", "Start exploring Legacy New Tab by checking out the settings at the bottom right corner of the screen.", "success");
        var displayedName = document.getElementById("displayedName")
        if (name.length != 0 && name != " ") {
          //console.log(name);
          window.localStorage.setItem("username", name);
          displayedName.innerHTML = "Hello " + name
        }
      });
      temperature_toggle.classList.add("active");
      document.getElementById('contrast-info-bar-toggle').classList.add("active");
    }
    if (typeof prevVersion != 'undefined') {
      //console.log("Extension Updated");
      swal("News From LNT!", "The biggest update yet! LNT is packed with more power, more speed, and more efficiency. Checkout the updated Background Menu in Settings.", "warning")
    }
    localStorage.version = currVersion
  }
}

$(function() {
  $("#reminder-circle").click(function() {
    $("#reminder-circle").toggle('scale');
    $(".reminder-box").toggle('scale')
  });
  $(".reminder-box-toggle").click(function() {
    $("#reminder-circle").toggle('scale');
    $(".reminder-box").toggle('scale')
  });
  var btn = $('.search-button'),
    val_length;
  $('input#searchBarInput').keyup(function() {
    val_length = $(this).val().length;
    if (val_length > 0) {
      btn.addClass('typed')
    } else {
      btn.removeClass('typed')
    }
  });
  btn.click(function() {
    if (val_length > 0) {
      $('input#searchBarInput').val('').trigger('keyup').focus()
    }
  });
  $('#changeBG').click(function() {
    localStorage.setItem("lastReloaded",parseInt(localStorage.getItem("lastReloaded"))+10);
    document.location.reload();
  });
});

window.addEventListener('load', function() {
  document.querySelector('input[type="file"]').addEventListener('change', function() {
      if (this.files && this.files[0]) {
         var img = document.createElement("IMG");  // $('img')[0]
         img.width = 1600;
         img.length=900;
          img.src = URL.createObjectURL(this.files[0]); // set src to file url
          img.onload = function() {
            convertImageToDataURI(img).then(function(data) {
              localStorage.setItem('URI', data);
            });
          };
          var url = 'url(' + URL.createObjectURL(this.files[0]) + ') no-repeat center center fixed';
          $('body').css('background', url);
          window.localStorage.setItem("keep_bg", "yes");
      }
  });
});

$(window).load(function() {
  $('#preloader').fadeOut('slow', function() {
    $(this).remove()
  })
});
chrome.browserAction.onClicked.addListener(function(activeTab) {
  var newURL = "/dashboard.html";
  chrome.tabs.create({
    url: newURL
  })
});

document.querySelector('input.bgDelay').addEventListener('change', function(e){
  //console.log(e.srcElement.value);
  localStorage.setItem("bgDelay",e.srcElement.value);
  document.querySelector('input.bgDelay').value=e.srcElement.value;
});

$('#fahrenheit').click(function() {
  tempChanger("#celsius", '#fahrenheit', '#celsius', 0, "Celsius", "r");
});
$('#celsius').click(function() {
  tempChanger("#fahrenheit", '#celsius', '#fahrenheit', 0, "Fahrenheit", "a");
});
temperature_toggle.addEventListener("click", function() {
  if (!temperature_toggle.classList.contains("active")) {
    tempChanger("#fahrenheit", '#celsius', '#fahrenheit', 0, "Fahrenheit", "r");
  } else {
    tempChanger("#celsius", '#fahrenheit', '#celsius', 0, "Celsius", "a");
  }
});
$('#time-12').click(function() {
  timeChanger("none", "block", "24-hr", "", "", "a", "yes");
});
$('#time-24').click(function() {
  timeChanger("block", "none", "12-hr", "", "", "r", "yes");
});
time_toggle.addEventListener("click", function() {
  if (!time_toggle.classList.contains("active")) {
    timeChanger("none", "block", "24-hr", "", "", "r", "no");
  } else {
    timeChanger("block", "none", "12-hr", "", "", "a", "no");
  }
});


getQuote();

async function getQuote() {
  var currentQuote = '',
    currentAuthor = '';
  $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&data=").success(function(data) {
    if (data.quoteAuthor == "") {
      currentAuthor = "Unknown Author";
    } else {
      currentAuthor = data.quoteAuthor;
    };
    currentQuote = data.quoteText;
    $(".quote-text").animate({
        opacity: 0
      }, 500,
      function() {
        $(this).animate({
          opacity: 1
        }, 500);
        $('#text').text("\"" + currentQuote + "\"" + "  -  " + currentAuthor);
        localStorage.setItem("quote", "\"" + currentQuote + "\"" + "  -  " + currentAuthor);
      });
  })
};
