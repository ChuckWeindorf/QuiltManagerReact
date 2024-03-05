import { useEffect, useState } from 'react';
import { fetchCustomers, putCustomer, postCustomer, fetchWorkorders } from '../components/fetchRoutines';
import { useLocation } from 'react-router-dom';
import { ShowWorks } from './shared.workorder';
import { NavLink } from 'react-router-dom';

function CustomerPage(props)
{   
    const objCust = {CustomerID: 0,
                     FirstName: "",
                     LastName: "",
                     eMail: "",
                     CellPhone: "",
                     HomePhone: "",
                     Address: "",
                     City: "",
                     State: "",
                     Zip: ""
                    }

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

   useEffect( () => {    
                    if (navState == "New") 
                          {  //use callback to wait for data to resolve in createcustomer...
                            createCustomer(() => {
                            })                              
                          }
                    else {
                      retrieveCustomer();
                      retrieveWorks();                      
                    }
                    }, []);

            function createCustomer(callbackFunction)
                { 
                  postCustomer(objCust)
                   .then (data => {navState = data.insertId;
                                   retrieveCustomer();
                                   retrieveWorks()})
                   .catch(console.error);
                }

            async function retrieveCustomer() 
            {
               fetchCustomers(navState)
                    .then(data => setCust(data[0]))
                    .catch(err => console.error);
            };

            async function saveCustomer()
            {
              putCustomer(cust)
                  .then()
                  .catch(err => console.error);
            }
          
            //Fill the workorders array from the database
            async function retrieveWorks() 
            {
               fetchWorkorders(navState)
                 .then(data => setArrWorks(data.map(element => element)))
                 .catch(err => console.error);
            };
   return (
   <>
   <form onSubmit={handleSubmit}>
   <table id="oneCust">
    <thead>
    </thead>
    <tbody>
    <tr><td>ID</td><td>{cust.CustomerID}</td></tr>
    <tr><td>First Name</td><td><input type="text" name="FirstName"
                              value={cust.FirstName} onChange={handleInputChange}/></td></tr>
    <tr><td>Last Name</td><td><input type="text" name="LastName"
                              value={cust.LastName} onChange={handleInputChange}/></td></tr>
    <tr><td>eMail</td><td><input type="text" name="eMail"
                              value={cust.eMail} onChange={handleInputChange}/></td></tr>
    <tr><td>Cell Phone</td><td><input type="text" name="CellPhone"
                              value={cust.CellPhone} onChange={handleInputChange}/></td></tr>
    <tr><td>Home Phone</td><td><input type="text" name="HomePhone"
                              value={cust.HomePhone} onChange={handleInputChange}/></td></tr>
    <tr><td>Address</td><td><input type="text" name="Address"
                              value={cust.Address} onChange={handleInputChange}/></td></tr>
    <tr><td>City</td><td><input type="text" name="City"
                              value={cust.City} onChange={handleInputChange}/></td></tr>
    <tr><td>State</td><td><input type="text" name="State"
                              value={cust.State} onChange={handleInputChange}/></td></tr>
    <tr><td>Zip</td><td><input type="text" name="Zip"
                              value={cust.Zip} onChange={handleInputChange}/></td></tr>
    <tr><td></td><td>
        <button className="custButton" type="Submit">Save Changes to Customer</button>
        </td></tr>
    </tbody>
    </table>
    </form>
    <div><NavLink to="/workorder" state={{navState: `New:${cust.CustomerID}`}}>
        <button type="button" className="custButton">Start a new Workorder</button></NavLink>
        </div>
    {arrWorks[0] && <div id="workContainer">{ShowWorks(arrWorks, "All")}</div>}
   </>
   );
  }

  export { CustomerPage } 
