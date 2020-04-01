// Sets a data attribute that fires onclick for analytics click events
(function () {
  var analyticsList = Array.from(document.querySelectorAll('[data-analytics]'));

  var recurseDOM = function (last, callback) {
    callback(last);
    if (last.parentElement) {
      recurseDOM(last.parentElement, callback);
    }
  };

  analyticsList.forEach(function (el) {
    el.addEventListener('click', function (e) {
      var targetElement = e.target
      var blankTarget = targetElement.target === '_blank';

      // Only prevent default when link will load in the same window (is not target="_blank")
      if (!blankTarget) {
        e.preventDefault();
      }

      if (el.getAttribute('data-analytics-parent') !== null && el.getAttribute('data-analytics-parent') !== undefined) {
        if (e.target.getAttribute('data-analytics-child')) {
          trackEvent(el.getAttribute('data-analytics'),
            analyticsTrackProps(
              e.target,
              JSON.parse(e.target.getAttribute('data-analytics-child'))
            )
          );
        }
      } else {
        trackEvent(el.getAttribute('data-analytics'), analyticsTrackProps(el));
      }

      // grab link and fire it
      var link;
      recurseDOM(e.target, function (last) {
        if (last.href)
          link = last.href;
      });

      // only set window.location to link when opening in the same window
      if (link && !blankTarget) {
        window.location = link;
      }
    });
  });
}());
