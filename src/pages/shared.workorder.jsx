import { simpleDate, daysBetweenDates } from "../components/common";
import { NavLink } from "react-router-dom";

/**
 *
 * @param {One workorder object.  The dates determine the color of workorder progress} work
 * @returns a color variable that applies to the status of this workorder
 */
function GetBackground(work) {
  let colorAnswer;
  let difference_In_Days = daysBetweenDates(new Date(work.TargetDate));

  if (work.CompleteDate) {
    colorAnswer = "rgb(2, 74, 2)";
  } else if (!work.ReceivedDate) {
    colorAnswer = "blue";
  } else if (!work.StartDate) {
    colorAnswer = "orange";
  } else if (difference_In_Days > 0) {
    colorAnswer = "red";
  } else if (difference_In_Days > -5) {
    colorAnswer = "rgb(230, 112, 1)";
  } else if (work.StartDate) {
    colorAnswer = "rgb(23, 141, 5)";
  }
  return colorAnswer;
}

/**
 *
 * @param {One workorder object} work
 * @param {What status is the filter to show to the owner} cstrStatus
 * @returns True to show, false to suppress
 */
function canShowStatus(work, cstrStatus) {
  let vbolShow = true;
  if (cstrStatus == "All") {
  } else if (cstrStatus == "Completed" && work.CompleteDate) {
  } else if (cstrStatus == "NotCompleted" && !work.CompleteDate) {
  } else if (work.CompleteDate) {
    vbolShow = false;
  } else if (
    cstrStatus == "Warning" &&
    daysBetweenDates(new Date(work.TargetDate)) > -5
  ) {
  } else if (cstrStatus == "Mail" && !work.ReceivedDate) {
  } else if (cstrStatus == "Started" && work.StartDate) {
  } else {
    vbolShow = false;
  }

  return vbolShow;
}

/**
 * NOTE: reusable react return for the Workorders page and the Customer page
 * @param {an array of all workorders} arrWorks
 * @param {the filter that will allow a workorder to be shown} cstrStatus
 * @returns the HTML for any workorder that passes the test for the filter.
 */
function ShowWorks({ arrWorks, cstrStatus }) {
  return (
    <>
      {arrWorks.map((work, index) => {
        if (canShowStatus(work, cstrStatus)) {
          return (
            <div
              className="workOne"
              key={`d${index}`}
              style={{ backgroundColor: GetBackground(work) }}
            >
              <div className="workTitle">{work.LastName}</div>
              <div className="workProps">
                Workorder: {work.SaleID} <br />
                Customer: {work.CustomerID}
                <br />
                Type: {work.Worktype}
                <br />
                Description: {work.WorkDescription}
                <br />
                Order Date: {simpleDate(work.OrderDate, false)}
                <br />
                Receive Date: {simpleDate(work.ReceivedDate, false)}
                <br />
                Start Date: {simpleDate(work.StartDate, false)}
                <br />
                Complete Date: {simpleDate(work.CompleteDate, false)}
                <br />
                Target Date: {simpleDate(work.TargetDate, false)}
                <br />
                Paid: {work.Paid ? "Yes" : "No"}
                <br />
                QuoteAmount: {work.QuoteAmount}
              </div>
              <NavLink
                className="navType"
                to="/workorder"
                state={{ navState: `${work.SaleID}` }}
              >
                <button type="button" className="goWorkButton">
                  SEE
                </button>
              </NavLink>
            </div>
          );
        }
      })}
    </>
  );
}

export { ShowWorks };
