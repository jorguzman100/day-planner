$(document).ready(function () {
  /* ---------- Global variables ---------- */
  var activitiesArray = [
    {
      time: moment().startOf("day").add(8, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(9, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(10, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(11, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(12, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(13, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(14, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(15, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(16, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: moment().startOf("day").add(17, "hours").format("h:mm a"),
      activity: "",
      button: "<i class='far fa-save'></i>",
    },
  ];
  var currentMonth = moment();
  var displayedDate = currentMonth;
  var monthsChange = 1;

  init();
  /* ---------- Event listeners ---------- */

  $(".save").on("click", saveActivity);
  $("td").mouseenter(function () {
    $(this).css("background", "lightgray");
  });

  $("td").mouseleave(function () {
    $(this).css("background", "white");
  });

  $("td").on("click", function () {
    console.log($(this).text());
  });

  $("#prevY").on("click", changeDate);
  $("#nextY").on("click", changeDate);
  $("#prevM").on("click", changeDate);
  $("#nextM").on("click", changeDate);

  /* ---------- Function declarations ---------- */
  function init() {
    $("#year").text(displayedDate.format("YYYY"));
    $("#month").text(displayedDate.format("MMMM"));
    displayActivities();
  }

  function displayActivities() {
    activitiesArray.forEach(function (activity, index) {
      // Load activitiesArray from localStorage
      var activityLoad = "activityWrap" + index;
      var activityWrapLoaded = localStorage.getItem(`${activityLoad}`);
      activityWrapLoaded = JSON.parse(activityWrapLoaded);
      if (localStorage.getItem(`${activityLoad}`) != null) {
        activitiesArray[index] = activityWrapLoaded;
      }

      // Create the activity-wraps and display info from activitiesArray
      var divActWrap = `<div class="activity-wrap input-group">
                    <div class="input-group-prepend">
                      <span class="time input-group-text">${activitiesArray[index].time}</span>
                    </div>
                    <input type="text" class="activity form-control" placeholder="" value="${activitiesArray[index].activity}">
                    <div class="input-group-append">
                      <button class="save btn btn-info" type="button" data-index="${index}">${activitiesArray[index].button}</button>
                    </div>
                  </div>`;
      $("#activities").append(divActWrap);

      // Assign backgrpund format according to time of the day
      agendaHour = parseInt(index + 8);
      var current = moment().hour();
      if (current > agendaHour) {
        $("#activities")
          .children()
          .eq(index)
          .children()
          .eq(1)
          .css("background", "#e2e3e5");
      } else if (current === agendaHour) {
        $("#activities")
          .children()
          .eq(index)
          .children()
          .eq(1)
          .css("background", "#bee5eb");
      } else {
        $("#activities")
          .children()
          .eq(index)
          .children()
          .eq(1)
          .css("background", "white");
      }
    });
    $("#activities").fadeIn(1000);
  }

  function saveActivity() {
    $(".activity-saved").fadeIn(1000);
    $(".activity-saved").fadeOut(1000);

    // Save to localStorage
    var index = $(this).attr("data-index");
    var time = $("#activities")
      .children()
      .eq(index)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .text();
    var activity = $("#activities").children().eq(index).children().eq(1).val();
    var button = $(this).html();
    var activityWrap = {
      time: time,
      activity: activity,
      button: button,
    };
    var activityWrapText = JSON.stringify(activityWrap);
    var activitySafe = "activityWrap" + index;
    localStorage.setItem(activitySafe, activityWrapText);

    // Update activitiesArray
    console.log(activitiesArray);
    activitiesArray[index] = activityWrap;
    console.log(activitiesArray);
  }

  function changeDate() {
    switch ($(this).attr("id")) {
      case "nextY":
        displayedDate = displayedDate.add(1, "years");
        break;
      case "prevY":
        displayedDate = displayedDate.subtract(1, "years");
        break;
      case "nextM":
        displayedDate = displayedDate.add(1, "months");
        break;
      case "prevM":
        displayedDate = displayedDate.subtract(1, "months");
        break;
    }
    $("#year").text(displayedDate.format("YYYY"));
    $("#month").text(displayedDate.format("MMMM"));
    console.log(displayedDate.format("MMM Do YY"));
  }
});
