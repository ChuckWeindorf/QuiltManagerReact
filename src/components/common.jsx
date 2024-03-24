import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import {
  ArtifactsPage,
  FavoritesPage,
  WorkOrdersPage,
  CustomerListPage,
  CustomerPage,
  ArtifactPage,
  WorkOrderPage,
  EtsyPage,
  LoginPage,
  TestPage,
} from "../pages";

/**
 *
 * @returns a T/F switch to limit the routes availabe to a Guest account.  Will be replaced by formal login later
 */
function guestMode() {
  return !sessionStorage.getItem("OwnerMode");
}

/**
 *
 * @returns a T/F switch to limit the routes availabe to a Guest account.  Will be replaced by formal login later
 */
function setOwnerMode() {
  sessionStorage.setItem("OwnerMode", "true");
}

// Routines for reuse on all pages
//Header and Menu
/**
 *
 * @returns for all presentation screens, returns the common header including the logo and all appropriate route
 *          options and NavLink menu choices
 */
function HeaderPresent() {
  //console.log("Guestmode " + guestMode());
  return (
    <>
      <BrowserRouter>
      <div className="qmHeader" id="qmH1">
        <img src="../logo.png" id="logo" />
        {guestMode() && <NavLink to="/login" id="loginNav">Login&nbsp;&nbsp;&nbsp;</NavLink>}
        </div>
      <Routes>
          <Route path="/" element={<ArtifactsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/guestFavs" element={<FavoritesPage />} />
          <Route path="/workorders" element={<WorkOrdersPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customerpage" element={<CustomerPage />} />
          <Route path="/artifact" element={<ArtifactPage />} />
          <Route path="/workorder" element={<WorkOrderPage />} />
          <Route path="/etsy" element={<EtsyPage />} />
          <Route path="/test" element={<TestPage />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

/**
 *
 * @returns the NALinks for the owner session
 */
function conditionalNavLinks() {
  return (
    <>
      <NavLink to="/">Pick a Pattern</NavLink>&nbsp;&nbsp;&nbsp;
      <NavLink to="/customers">Customers</NavLink>&nbsp;&nbsp;&nbsp;
      <NavLink to="/guestFavs">Guest Favorites</NavLink>&nbsp;&nbsp;&nbsp;
      <NavLink to="/workorders">WorkOrders</NavLink>&nbsp;&nbsp;&nbsp;
      <NavLink to="/etsy">Etsy</NavLink>&nbsp;&nbsp;&nbsp;
    </>
  );
}

/**
 *
 * @returns the routes availabe for the owner session
 */
function ConditionalMenu() {
  return (
    <>
        <div className="qmHeader" id="qmH2">
          &nbsp;&nbsp;&nbsp;
          {!guestMode() && conditionalNavLinks()}
        </div>
    </>
  );
}

/**
 *
 * @param {string date as presented from the database -or- date object in javascript} cstrDate
 * @param {Use today's date} vbolPreFill
 * @returns an ISO compatible date with the time paramenters stripped off YYYY-MM-DD only
 */
function simpleDate(cstrDate, vbolPreFill) {
  let vstrDateOnly = "";

  if (vbolPreFill) {
    vstrDateOnly = new Date().toISOString();
  } else if (typeof cstrDate == "string") {
    vstrDateOnly = cstrDate;
  } else if (cstrDate) {
    vstrDateOnly = cstrDate.toISOString();
  }

  return vstrDateOnly.substring(0, 10);
}

/**
 *
 * @param {this date is the earlier one} datFrom
 * @param {this date is the later one.  If it does not exist, use today's date} datTo
 * @returns The calculation converts thousands of seconds into an integer that equals 1.0 for one day
 *          Subtracting the two dates yields a difference in days
 */
function daysBetweenDates(datFrom, datTo) {
  //if there is no datTo, use current date
  let datToday = datTo;
  if (!datToday) {
    datToday = new Date();
  }

  let Difference_In_Time = datToday.getTime() - datFrom.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
}

export { HeaderPresent, 
         simpleDate, 
         daysBetweenDates, 
         guestMode, 
         setOwnerMode, 
         ConditionalMenu };
