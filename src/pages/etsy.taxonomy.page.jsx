import { useEffect, useState } from "react";
import { fetchEtsyTaxonomy } from "../components/fetchRoutines";

function EtsyPage() {
  let [arrAll, setArrAll] = useState([]);
  let [arrTax1, setArrTax1] = useState([]);
  let [arrTax2, setArrTax2] = useState([]);
  let [arrTax3, setArrTax3] = useState([]);
  let [arrTax4, setArrTax4] = useState([]);
  let [arrTax5, setArrTax5] = useState([]);
  let [arrTax6, setArrTax6] = useState([]);
  let [arrTax7, setArrTax7] = useState([]);

  useEffect(() => {
    getEtsy();
  }, []);

  async function getEtsy() {
    await fetchEtsyTaxonomy()
      .then((data) => {
        //console.log(data);
        setArrAll(data.results.map((element) => element));
        setArrTax1(data.results.map((element) => element));
      })
      .catch((err) => console.error);
  }

  function buildArray(e) {
    let vintLevel = e.target.id[1];
    let vintItem = e.target.id.substring(2);
    // console.log(`Level is ${vintLevel} selection is ${vintItem}`);
    if (vintLevel == "1") {
      setArrTax2(arrTax1[vintItem].children.map((element) => element));
      setArrTax1([arrTax1[vintItem]]);
      setArrTax3([]);
      setArrTax4([]);
      setArrTax5([]);
      setArrTax6([]);
      setArrTax7([]);
    } else if (vintLevel == "2") {
      if (arrTax2[vintItem].children) {
        setArrTax3(arrTax2[vintItem].children.map((element) => element));
      }
      setArrTax2([arrTax2[vintItem]]);
      setArrTax4([]);
      setArrTax5([]);
      setArrTax6([]);
      setArrTax7([]);
    } else if (vintLevel == "3") {
      setArrTax4(arrTax3[vintItem].children.map((element) => element));
      setArrTax3([arrTax3[vintItem]]);
      setArrTax5([]);
      setArrTax6([]);
      setArrTax7([]);
    } else if (vintLevel == "4") {
      setArrTax5(arrTax4[vintItem].children.map((element) => element));
      setArrTax4([arrTax4[vintItem]]);
      setArrTax6([]);
      setArrTax7([]);
    } else if (vintLevel == "5") {
      setArrTax6(arrTax5[vintItem].children.map((element) => element));
      setArrTax5([arrTax5[vintItem]]);
      setArrTax7([]);
    } else if (vintLevel == "6") {
      setArrTax7(arrTax6[vintItem].children.map((element) => element));
      setArrTax6([arrTax6[vintItem]]);
    }
  }

  function BuildTRfromObject({ tmpArr, vintLevel }) {
    return tmpArr.map((element, index) => {
      return (
        <tr key={index}>
          <td key={index} id={index}>
            <button
              id={`L${vintLevel}${index}`}
              type="button"
              onClick={buildArray}
            >
              {element.id}
            </button>
          </td>
          <td key={`id${index}`}>{element.name}</td>
        </tr>
      );
    });
  }
  function resetAll() {
    setArrTax1(arrAll);
    setArrTax2([]);
    setArrTax3([]);
    setArrTax4([]);
    setArrTax5([]);
    setArrTax6([]);
    setArrTax7([]);
  }
  return (
    <>
      <h1>etsy Taxonomy</h1>
      <div>
        <button type="button" onClick={resetAll}>
          Start Over
        </button>
      </div>
      <table>
        <tbody>
          <BuildTRfromObject tmpArr={arrTax1} vintLevel={"1"}/>
          <tr>
            <td>====</td>
            <td>======================</td>
          </tr>
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax2} vintLevel={"2"}/>}
          {arrTax2[0] && (
            <tr>
              <td>====</td>
              <td>======================</td>
            </tr>
          )}
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax3} vintLevel={"3"}/>}
          {arrTax3[0] && (
            <tr>
              <td>====</td>
              <td>======================</td>
            </tr>
          )}
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax4} vintLevel={"4"}/>}
          {arrTax4[0] && (
            <tr>
              <td>====</td>
              <td>======================</td>
            </tr>
          )}
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax5} vintLevel={"5"}/>}
          {arrTax5[0] && (
            <tr>
              <td>====</td>
              <td>======================</td>
            </tr>
          )}
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax6} vintLevel={"6"}/>}
          {arrTax6[0] && (
            <tr>
              <td>====</td>
              <td>======================</td>
            </tr>
          )}
          {arrTax2[0] && <BuildTRfromObject tmpArr={arrTax7} vintLevel={"7"}/>}
        </tbody>
      </table>
    </>
  );
}

export { EtsyPage };
