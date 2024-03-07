import { useEffect, useState } from "react";
import { fetchCustomers } from "../components/fetchRoutines";
import { NavLink } from "react-router-dom";

function CustomerListPage(props) {
  let [arrCust, setArrCust] = useState([]);

  useEffect(() => {
    retrieveCustomers();
  }, []);

  async function retrieveCustomers() {
    await fetchCustomers()
      .then((data) => setArrCust(data.map((element) => element)))
      .catch((err) => console.error);
  }

  function ShowCusts() {
    return (
      <>
        {arrCust.map((cust, index) => {
          return (
            <tr className="custOne" key={`c${index}`}>
              <td key={`td1${index}`}>{cust.CustomerID}</td>
              <td key={`td2${index}`}>{cust.FirstName}</td>
              <td key={`td3${index}`}>{cust.LastName}</td>
              <td key={`td4${index}`}>{cust.eMail}</td>
              <td key={`td5${index}`}>{cust.CellPhone}</td>
              <td key={`td7${index}`}>{cust.Address}</td>
              <td key={`td8${index}`}>{cust.City}</td>
              <td key={`td9${index}`}>{cust.State}</td>
              <td key={`td10${index}`}>{cust.Zip}</td>
              <td key={`td11${index}`}>
                <NavLink
                  className="navType"
                  to="/customerpage"
                  state={{ navState: `${cust.CustomerID}` }}
                >
                  <button type="button" className="custButton">
                    Cust
                  </button>
                </NavLink>
              </td>
            </tr>
          );
        })}
      </>
    );
  }
  //<td key={`td6${index}`}>{cust.HomePhone}</td>
  //console.log(arrCust);
  return (
    <>
      <table id="allCust">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>eMail</th>
            <th>Cell Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>St</th>
            <th>Zip</th>
            <th>
              <NavLink
                className="navType"
                to="/customerpage"
                state={{ navState: "New" }}
              >
                <button type="button" className="custButton">
                  NEW
                </button>
              </NavLink>
            </th>
          </tr>
        </thead>
        <tbody>
          <ShowCusts />
        </tbody>
      </table>
    </>
  );
}
//   <th>Home Phone</th>
export { CustomerListPage };
