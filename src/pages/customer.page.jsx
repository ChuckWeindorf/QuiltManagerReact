import { useEffect, useState } from "react";
import {
  fetchCustomers,
  putCustomer,
  postCustomer,
  fetchWorkorders,
} from "../components/fetchRoutines";
import { useLocation } from "react-router-dom";
import { ShowWorks } from "./shared.workorder";
import { NavLink } from "react-router-dom";
import { ConditionalMenu } from "../components/common";

function CustomerPage(props) {
  const objCust = {
    CustomerID: 0,
    FirstName: "",
    LastName: "",
    eMail: "",
    CellPhone: "",
    HomePhone: "",
    Address: "",
    City: "",
    State: "",
    Zip: "",
  };

  //console.log("Start");
  const location = useLocation();
  let { navState } = location.state;
  //POST a new customer then focus on that record...

  let [arrWorks, setArrWorks] = useState([]);

  //console.log(navState);
  //Initialize to have all values needed present in the
  //default cust object.  The database will fill the fields if
  //found.  It will allow for creation of a new customer as well.
  let [cust, setCust] = useState(objCust);

  const handleSubmit = (e) => {
    e.preventDefault();
    //Put fields back to database!
    saveCustomer();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCust({ ...cust, [name]: value });
  };

  useEffect(() => {
    if (navState == "New") {
      //use callback to wait for data to resolve in createcustomer...
      createCustomer(() => {});
    } else {
      retrieveCustomer();
      retrieveWorks();
    }
  }, []);

  function createCustomer(callbackFunction) {
    postCustomer(objCust)
      .then((data) => {
        navState = data.insertId;
        retrieveCustomer();
        retrieveWorks();
      })
      .catch(console.error);
  }

  async function retrieveCustomer() {
    fetchCustomers(navState)
      .then((data) => setCust(data[0]))
      .catch((err) => console.error);
  }

  async function saveCustomer() {
    putCustomer(cust)
      .then()
      .catch((err) => console.error);
  }

  //Fill the workorders array from the database
  async function retrieveWorks() {
    fetchWorkorders(navState)
      .then((data) => setArrWorks(data.map((element) => element)))
      .catch((err) => console.error);
  }

  function ShowCustomer() {
    let arrText = [];
    const carrT = [
      "First Name",
      "Last Name",
      "eMail",
      "Cell Phone",
      "Home Phone",
      "Address",
      "City",
      "State",
      "Zip",
    ];
    const carrV = [
      "FirstName",
      "LastName",
      "eMail",
      "CellPhone",
      "HomePhone",
      "Address",
      "City",
      "State",
      "Zip",
    ];
    arrText.push(
      <tr key="a9">
        <td key="b9">ID</td>
        <td key="c9">{cust.CustomerID}</td>
      </tr>
    );
    for (let vint = 0; vint < 9; vint++) {
      arrText.push(
        <tr key={"a" + vint}>
          <td key={"b" + vint}>{carrT[vint]}</td>
          <td key={"c" + vint}>
            <input
              type="text"
              name={carrV[vint]}
              key={"d" + vint}
              value={cust[carrV[vint]] || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
      );
    }
    return arrText;
  }
  //note, using the INPUT generated through a function breaks the focus on a field while updating.  By
  //using a function, it works.

  return (
    <>
      <ConditionalMenu/>
      <form onSubmit={handleSubmit}>
        <table id="oneCust">
          <thead></thead>
          <tbody>
            {ShowCustomer()}
            <tr>
              <td></td>
              <td>
                <button className="custButton" type="Submit">
                  Save Changes to Customer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div>
        <NavLink to="/workorder" state={{ navState: `New:${cust.CustomerID}` }}>
          <button type="button" className="custButton">
            Start a new Workorder
          </button>
        </NavLink>
      </div>
      {arrWorks[0] && (
        <div id="workContainer">
          <ShowWorks arrWorks={arrWorks} cstrStatus={"All"} />
        </div>
      )}
    </>
  );
}

export { CustomerPage };
