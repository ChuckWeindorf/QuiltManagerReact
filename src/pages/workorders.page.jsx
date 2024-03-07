import { useState, useEffect } from "react";
import { ShowWorks } from "./shared.workorder";
import { fetchWorkorders } from "../components/fetchRoutines";

function WorkOrdersPage(props) {
  let [arrWorks, setArrWorks] = useState([]);
  let [cstrStatus, setcstrStatus] = useState("All");

  useEffect(() => {
    retrieveWorks();
  }, []);

  //Fill the workorders array from the database
  async function retrieveWorks() {
    await fetchWorkorders()
      .then((data) => setArrWorks(data.map((element) => element)))
      .catch((err) => console.error);
  }

  return (
    <>
      <div id="workTop">
        <h1>&nbsp;Workorder Status</h1>
        <div id="workFilter">
          &nbsp;&nbsp;Select a Status:{" "}
          <select
            id="workSel"
            onChange={(e) => {
              setcstrStatus(e.target.value);
            }}
          >
            <option key="w0" value="All">
              All
            </option>
            <option key="w1" value="Completed">
              Completed
            </option>
            <option key="w2" value="NotCompleted">
              Not Completed
            </option>
            <option key="w3" value="Mail">
              In Mail
            </option>
            <option key="w4" value="Started">
              Started
            </option>
            <option key="w5" value="Warning">
              Warning
            </option>
          </select>
        </div>
      </div>
      <div id="workContainer"><ShowWorks arrWorks={arrWorks} cstrStatus={cstrStatus}/></div>
    </>
  );
}

export { WorkOrdersPage };
