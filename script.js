$(document).ready(function () {
  /* ---------- Global variables ---------- */
  var activitiesArray = [
    {
      time: "8 am",
      activity: "Activity at 9 am",
      button: "<i class='far fa-save'></i>",
    },
    {
      time: "9 am",
      activity: "Activity at 10 am",
      button: "Button2",
    },
    {
      time: "10 am",
      activity: "Activity at 11 am",
      button: "Button3",
    },
    {
      time: "11 am",
      activity: "Activity at 12 pm",
      button: "Button4",
    },
    {
      time: "12 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "1 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "2 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "3 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "4 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "5 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "6 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "7 pm",
      activity: "",
      button: "Button",
    },
    {
      time: "8 pm",
      activity: "",
      button: "Button",
    },
  ];

  /* ---------- Event listeners ---------- */
  init();
  $(".save").on("click", saveActivity);

  /* ---------- Function declarations ---------- */
  function init() {
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
                      <button class="save btn btn-info" type="button" data-index="${index}"><i class="far fa-save"></i></button>
                    </div>
                  </div>`;
      $("#activities").append(divActWrap);
    });
  }

  function saveActivity() {
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
    var button = $(this).text();
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
});
