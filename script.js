$(document).ready(function () {
  /* ******************** Global variables ******************** */

  var STORAGE_PREFIX = "dayPlanner.activityWrap";
  var THEME_STORAGE_KEY = "dayPlanner.theme";
  var LOGO_LIGHT_PATH = "./Assets/fluxday-logo-light.svg";
  var LOGO_DARK_PATH = "./Assets/fluxday-logo-dark.svg";
  var WORKDAY_START_HOUR = 8;
  var WORKDAY_END_HOUR = 17;
  var MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var activitiesArray = buildDefaultActivities();
  var displayedDate = new Date();
  var countedDatesArray = [];
  var localStorageObjectsArray = [];

  init();

  /* ******************** Function declarations ******************** */
  function init() {
    initializeTheme();
    bindThemeToggle();
    migrateLegacyActivityStorage();
    $("#year").text(displayedDate.getFullYear());
    $("#month").text(MONTH_NAMES[displayedDate.getMonth()]);
    countLocalStorageActivitiesDates();
    createTBody();
    displayDayDate();
  }

  function buildDefaultActivities() {
    var defaultActivities = [];

    for (var hour = WORKDAY_START_HOUR; hour <= WORKDAY_END_HOUR; hour++) {
      defaultActivities.push({
        date: "",
        time: formatHour(hour),
        activity: "",
      });
    }

    return defaultActivities;
  }

  function formatHour(hour24) {
    var meridiem = hour24 >= 12 ? "pm" : "am";
    var hour12 = hour24 % 12;

    if (hour12 === 0) {
      hour12 = 12;
    }

    return `${hour12}:00 ${meridiem}`;
  }

  function formatOrdinal(day) {
    if (day % 100 >= 11 && day % 100 <= 13) {
      return `${day}th`;
    }

    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  function formatPlannerDate(date) {
    return `${MONTH_NAMES[date.getMonth()]} ${formatOrdinal(
      date.getDate()
    )} ${date.getFullYear()}`;
  }

  function getActivityStorageKey(index) {
    return `${STORAGE_PREFIX}.${index}`;
  }

  function initializeTheme() {
    var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme !== "light" && savedTheme !== "dark") {
      savedTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    }

    applyTheme(savedTheme, false);
  }

  function bindThemeToggle() {
    $("#themeToggle")
      .off("click")
      .on("click", function () {
        var currentTheme =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";
        var nextTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
  }

  function applyTheme(theme, persistTheme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeToggle(theme);
    updateBrandAssets(theme);

    if (persistTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }

  function updateThemeToggle(theme) {
    var toggle = $("#themeToggle");
    if (toggle.length === 0) {
      return;
    }

    var isDark = theme === "dark";
    toggle.attr("aria-pressed", String(isDark));
    $(".theme-toggle-label").text(isDark ? "Light Mode" : "Dark Mode");
  }

  function updateBrandAssets(theme) {
    var isDark = theme === "dark";
    var logoPath = isDark ? LOGO_DARK_PATH : LOGO_LIGHT_PATH;

    $("#brandLogo").attr("src", logoPath);
    $("#siteFavicon").attr("href", logoPath);
    $("#appleTouchIcon").attr("href", logoPath);
  }

  function getStoredActivity(key) {
    var storedActivity = localStorage.getItem(key);
    if (storedActivity == null) {
      return null;
    }

    try {
      storedActivity = JSON.parse(storedActivity);
    } catch (error) {
      return null;
    }

    if (
      !storedActivity ||
      typeof storedActivity !== "object" ||
      typeof storedActivity.date !== "string" ||
      typeof storedActivity.activity !== "string"
    ) {
      return null;
    }

    return {
      date: storedActivity.date,
      time:
        typeof storedActivity.time === "string" ? storedActivity.time : "",
      activity: storedActivity.activity,
    };
  }

  function migrateLegacyActivityStorage() {
    for (var i = 0; i < activitiesArray.length; i++) {
      var legacyKey = "activityWrap" + i;
      var namespacedKey = getActivityStorageKey(i);

      if (localStorage.getItem(namespacedKey) == null) {
        var legacyActivity = getStoredActivity(legacyKey);
        if (legacyActivity != null) {
          localStorage.setItem(namespacedKey, JSON.stringify(legacyActivity));
        }
      }

      if (localStorage.getItem(legacyKey) != null) {
        localStorage.removeItem(legacyKey);
      }
    }
  }

  /* ---------- Month View ---------- */
  function createTBody() {
    // Empty previous table displayed
    $("tbody").empty();

    var year = displayedDate.getFullYear();
    var month = displayedDate.getMonth();
    var firstDayOfMonth = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Monday-first grid offset: Monday=0 ... Sunday=6
    var startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    var dayCounter = 1;

    // Create the new Table Cells
    for (var r = 0; r < 6; r++) {
      var newRow = $("<tr>");
      var rowHasDay = false;

      newRow.attr("id", "row" + r);
      for (var d = 0; d < 7; d++) {
        var newCell = $("<td>");
        var newSpanNumDiv = $("<div>");
        var newSpanNum = $("<p>");
        var newSpanText = $("<p>");
        var cellIndex = r * 7 + d;

        newSpanNumDiv.attr("class", "dayNumDiv input-group-prepend");
        newSpanNum.attr("class", "dayNum");
        newSpanText.attr("class", "dayText");
        newSpanNumDiv.append(newSpanNum);

        if (cellIndex >= startOffset && dayCounter <= daysInMonth) {
          rowHasDay = true;

          var cellDate = new Date(year, month, dayCounter);
          var formattedDate = formatPlannerDate(cellDate);

          newSpanNum.text(formatOrdinal(dayCounter));
          newCell.attr("moment", formattedDate);

          // Display Activities Count
          countedDatesArray.forEach(function (countedDatesObject) {
            if (countedDatesObject.current === formattedDate) {
              newSpanText.text(`Acts: ${countedDatesObject.cnt}`);
              newCell.append(newSpanText);
            }
          });

          dayCounter++;
        }

        newCell.attr("class", "cell");
        newCell.attr("id", "cell" + r + d);
        newCell.prepend(newSpanNumDiv);

        newRow.append(newCell);
      }

      if (rowHasDay) {
        $("tbody").append(newRow);
      }

      if (dayCounter > daysInMonth) {
        break;
      }
    }

    $("tbody").hide();
    $("tbody").fadeIn(1000);
    countLocalStorageActivitiesDates();
  }

  function countLocalStorageActivitiesDates() {
    var datesArray = [];
    localStorageObjectsArray = [];

    for (var i = 0; i < localStorage.length; i++) {
      var localStorageKey = localStorage.key(i);
      if (!localStorageKey.startsWith(STORAGE_PREFIX + ".")) {
        continue;
      }

      var localStorageObject = getStoredActivity(localStorageKey);
      if (localStorageObject == null) {
        continue;
      }

      datesArray.push(localStorageObject.date);
      localStorageObjectsArray.push(localStorageObject);
    }

    // Source: How to count duplicate value in an array in javascript
    // https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
    datesArray.sort();
    var current = null;
    var cnt = 0;
    countedDatesArray = [];

    for (var j = 0; j < datesArray.length; j++) {
      if (datesArray[j] != current) {
        if (cnt > 0) {
          var countedDatesObject = {};
          countedDatesObject.current = current;
          countedDatesObject.cnt = cnt;
          countedDatesArray.push(countedDatesObject);
        }
        current = datesArray[j];
        cnt = 1;
      } else {
        cnt++;
      }
    }

    if (cnt > 0) {
      var finalCountedDatesObject = {};
      finalCountedDatesObject.current = current;
      finalCountedDatesObject.cnt = cnt;
      countedDatesArray.push(finalCountedDatesObject);
    }
    // - End of Source -
  }

  function changeDate() {
    switch ($(this).attr("id")) {
      case "nextY":
        displayedDate = new Date(
          displayedDate.getFullYear() + 1,
          displayedDate.getMonth(),
          1
        );
        break;
      case "prevY":
        displayedDate = new Date(
          displayedDate.getFullYear() - 1,
          displayedDate.getMonth(),
          1
        );
        break;
      case "nextM":
        displayedDate = new Date(
          displayedDate.getFullYear(),
          displayedDate.getMonth() + 1,
          1
        );
        break;
      case "prevM":
        displayedDate = new Date(
          displayedDate.getFullYear(),
          displayedDate.getMonth() - 1,
          1
        );
        break;
    }

    // Update the Month View
    $("#year").text(displayedDate.getFullYear());
    $("#month").text(MONTH_NAMES[displayedDate.getMonth()]);
    createTBody();

    // Update eventListeners
    clearEventListeners();
    eventListeners();
  }

  /* ---------- Daily Planner ---------- */
  function displayDayDate() {
    if ($("#dayDate").attr("moment") === undefined) {
      var today = formatPlannerDate(new Date());
      $("#dayDate").attr("moment", today);
      $("#dayDate").text(today);
    } else {
      var selectedDate = $(this).attr("moment");
      if (selectedDate) {
        $("#dayDate").attr("moment", selectedDate);
        $("#dayDate").text(selectedDate);
      }
    }

    highlightSelectedDayCell($("#dayDate").attr("moment"));
    displayActivities();
  }

  function highlightSelectedDayCell(dateLabel) {
    $("td").removeClass("is-selected");
    if (!dateLabel) {
      return;
    }

    $("td").each(function () {
      if ($(this).attr("moment") === dateLabel) {
        $(this).addClass("is-selected");
      }
    });
  }

  function displayActivities() {
    // Clear previous Dayly Planner Activities
    $("#activities").empty();

    // Create the new Daily Planner Activities
    activitiesArray.forEach(function (activity, index) {
      // Load activitiesArray from localStorage
      var activityLoad = getActivityStorageKey(index);
      var activityWrapLoaded = getStoredActivity(activityLoad);
      if (activityWrapLoaded != null) {
        activitiesArray[index].date = activityWrapLoaded.date;
        activitiesArray[index].activity = activityWrapLoaded.activity;
      }

      // Create the activity-wraps and display info from activitiesArray
      var divActWrap = $("<div>");
      var divPrepend = $("<div>");
      var spanTime = $("<span>");
      var inputActivity = $("<input>");
      var divAppend = $("<div>");
      var buttonSave = $("<button>");

      divActWrap.attr("class", "activity-wrap input-group");
      divPrepend.attr("class", "input-group-prepend");
      spanTime.attr("class", "time input-group-text");
      inputActivity.attr("type", "text");
      inputActivity.attr("class", "activity form-control");
      inputActivity.attr("placeholder", "");
      divAppend.attr("class", "input-group-append");
      buttonSave.attr("class", "save btn btn-info");
      buttonSave.attr("type", "button");
      buttonSave.attr("data-index", index);
      buttonSave.text("Save");

      spanTime.text(activitiesArray[index].time);

      if ($("#dayDate").attr("moment") === activitiesArray[index].date) {
        inputActivity.attr("value", activitiesArray[index].activity);
      }

      divPrepend.append(spanTime);
      divAppend.append(buttonSave);
      divActWrap.append(divPrepend);
      divActWrap.append(inputActivity);
      divActWrap.append(divAppend);
      $("#activities").append(divActWrap);

      // Assign background format according to time of the day
      var agendaHour = WORKDAY_START_HOUR + index;
      var current = new Date().getHours();
      var activityInput = $("#activities").children().eq(index).children().eq(1);
      activityInput.removeClass("slot-past slot-current slot-future");

      if (current > agendaHour) {
        activityInput.addClass("slot-past");
      } else if (current === agendaHour) {
        activityInput.addClass("slot-current");
      } else {
        activityInput.addClass("slot-future");
      }
    });

    $("#activities").hide();
    $("#activities").fadeIn(1000);

    // Update eventListeners
    clearEventListeners();
    eventListeners();
  }

  function saveActivity() {
    $(".activity-saved").fadeIn(1000);
    $(".activity-saved").fadeOut(1000);

    // Save to localStorage
    var index = $(this).attr("data-index");
    var date = $("#dayDate").attr("moment");
    var time = $("#activities")
      .children()
      .eq(index)
      .children()
      .eq(0)
      .children()
      .eq(0)
      .text();
    var activity = $("#activities").children().eq(index).children().eq(1).val();

    var activityWrap = {
      date: date,
      time: time,
      activity: activity,
    };
    var activityWrapText = JSON.stringify(activityWrap);
    var activitySafe = getActivityStorageKey(index);
    localStorage.setItem(activitySafe, activityWrapText);

    // Update activitiesArray
    activitiesArray[index] = activityWrap;
    countLocalStorageActivitiesDates();
    createTBody();
    clearEventListeners();
    eventListeners();
  }

  /* ******************** Event listeners ******************** */

  function clearEventListeners() {
    // Clear previous eventListeners
    $(".save").unbind();
    $("td").unbind();
    $("#prevY").unbind();
    $("#nextY").unbind();
    $("#prevM").unbind();
    $("#nextM").unbind();
  }

  function eventListeners() {
    // Update eventListeners
    $(".save").on("click", saveActivity);

    $("td").mouseenter(function () {
      if ($(this).attr("moment")) {
        $(this).addClass("is-hovered");
      }
    });

    $("td").mouseleave(function () {
      $(this).removeClass("is-hovered");
    });

    $("td").on("click", displayDayDate);
    $("#prevY").on("click", changeDate);
    $("#nextY").on("click", changeDate);
    $("#prevM").on("click", changeDate);
    $("#nextM").on("click", changeDate);
  }
});
