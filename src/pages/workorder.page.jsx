import { useState, useEffect } from "react";
import {
  fetchOneWorkorder,
  putWorkorder,
  postWorkorder,
  fetchCustomers,
  fetchArtifactListbyWorkorder,
  fetchFavorites,
  postArtifact,
  postSalesArtifact,
  saveArtifactImage,
} from "../components/fetchRoutines";
import { useLocation } from "react-router-dom";
import { simpleDate } from "../components/common";

function WorkOrderPage() {
  //After NAV from a location with workorders, focus on one workorder here
  const location = useLocation();
  let { navState } = location.state;

  //New WorkOrder Object
  let objWork = {
    SaleID: "",
    CustomerID: "",
    Worktype: "",
    WorkDescription: "",
    OrderDate: "",
    ReceivedDate: "",
    StartDate: "",
    CompleteDate: "",
    TargetDate: "",
    Paid: false,
    QuoteAmount: 0,
  };

  //New WorkOrder Object
  let objNewWork = {
    CustomerID: "",
    Worktype: "",
    WorkDescription: "",
    OrderDate: "",
    Paid: false,
    QuoteAmount: 0,
  };

  let [work, setWork] = useState(objWork);
  let [cust, setCust] = useState({});
  let [images, setImages] = useState([]);
  let [arrFavs, setArrFavs] = useState([]);

  useEffect(() => {
    getAllFavorites();
    if (navState.substring(0, 4) == "New:") {
      const cintCustID = navState.substring(4);
      objNewWork.CustomerID = cintCustID;
      objNewWork.OrderDate = simpleDate("", true);
      createWorkorder();
    } else {
      retrieveOneWork(navState);
    }
  }, []);

  function createWorkorder() {
    let tmpID = 0;
    postWorkorder(objNewWork)
      .then((data) => {
        retrieveOneWork(data.insertId);
      })
      .catch((err) => console.error);
  }

  //Fill the workorders array from the database
  function retrieveOneWork(vintWO) {
    fetchOneWorkorder(vintWO)
      .then((data) => {
        objWork = data[0];
        objWork.OrderDate = simpleDate(objWork.OrderDate);
        objWork.ReceivedDate = simpleDate(objWork.ReceivedDate);
        objWork.StartDate = simpleDate(objWork.StartDate);
        objWork.CompleteDate = simpleDate(objWork.CompleteDate);
        objWork.TargetDate = simpleDate(objWork.TargetDate);
        setWork(objWork);
        retrieveCustomer(objWork.CustomerID);
        retrieveImages(objWork.SaleID);
      })
      .catch((err) => console.error);
  }

  function retrieveCustomer(vintCustID) {
    fetchCustomers(vintCustID)
      .then((data) => setCust(data[0]))
      .catch((err) => console.error);
  }

  function retrieveImages(cintSaleID) {
    fetchArtifactListbyWorkorder(cintSaleID)
      .then((data) => setImages(data.map((image) => image)))
      .catch((err) => console.error);
  }

  function getAllFavorites() {
    fetchFavorites()
      .then((data) => {
        setArrFavs(
          data.map(
            (fav) =>
              fav.CatFileName + "|" + fav.ArtifactID + "~" + fav.GuestName
          )
        );
      })
      .catch((err) => console.error);
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name == "Paid") {
      if (value == "on") {
        value = 1;
      } else {
        value = 0;
      }
    }

    setWork({ ...work, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveWorkorder();
  };

  function saveWorkorder() {
    objWork = work;
    if (!objWork.ReceivedDate) {
      delete objWork.ReceivedDate;
    }
    if (!objWork.StartDate) {
      delete objWork.StartDate;
    }
    if (!objWork.CompleteDate) {
      delete objWork.CompleteDate;
    }
    if (!objWork.TargetDate) {
      delete objWork.TargetDate;
    }
    putWorkorder(objWork)
      .then()
      .catch((err) => console.error);
  }

  function addNextDate() {
    if (!work.ReceivedDate) {
      setWork({ ...work, ["ReceivedDate"]: simpleDate("", true) });
    } else if (!work.StartDate) {
      setWork({ ...work, ["StartDate"]: simpleDate("", true) });
    } else if (!work.CompleteDate) {
      setWork({ ...work, ["CompleteDate"]: simpleDate("", true) });
    }
  }

  function FindPattern() {
    return images.map((image, index) => {
      if (image.ArtType == "Pattern") {
        return (
          <img
            className="bigImg"
            key={"i1" + index}
            src={`${import.meta.env.VITE_ARTIFACTPATH}/${image.Category}/${
              image.FileName
            }`}
          />
        );
      }
    });
  }

  function FindCustomerArt() {
    return images.map((image, index) => {
      if (image.ArtType == "Customer" && image.Category == "Workorders") {
        return (
          <img
            className="bigImg"
            key={"i2" + index}
            src={`${import.meta.env.VITE_ARTIFACTPATH}/${image.Category}/${
              image.FileName
            }`}
          />
        );
      }
    });
  }

  function FindProgressArt() {
    return images.map((image, index) => {
      if (image.ArtType == "Progress" && image.Category == "Workorders") {
        return (
          <img
            className="bigImg"
            key={"i3" + index}
            src={`${import.meta.env.VITE_ARTIFACTPATH}/${image.Category}/${
              image.FileName
            }`}
          />
        );
      }
    });
  }

  function DisplayFavorites() {
    if (arrFavs.length > 0) {
      return (
        <>
          {arrFavs.map((image, index) => {
            return (
              <div className="faveChild" key={index}>
                <div className="favName2">
                  <p className="favHigh">
                    {image.substring(image.indexOf("~") + 1)}
                  </p>
                </div>
                <img
                  src={`${import.meta.env.VITE_ARTIFACTPATH}/${image.substring(
                    0,
                    image.indexOf("|")
                  )}`}
                  className="faveImage"
                />
                <button
                  key={"f" + index}
                  id={"f" + index}
                  className="faveTELL"
                  onClick={attachImage}
                >
                  Use Here
                </button>
              </div>
            );
          })}
        </>
      );
    }
  }

  function saveArtifact(cstrArtType, cstrCategory, cstrFileName) {
    postArtifact({
      ArtType: cstrArtType,
      Category: cstrCategory,
      FileName: cstrFileName,
      CreateDate: simpleDate("", true),
    })
      .then((data) => {
        saveFileSaleArtifact(data.insertId);
      })
      .catch((err) => console.error);
  }

  function saveFileSaleArtifact(cintArtifactID) {
    postSalesArtifact({
      SaleID: work.SaleID,
      ArtifactID: cintArtifactID,
    })
      .then((data) => {
        retrieveImages(work.SaleID);
      })
      .catch((err) => console.error);
  }

  function attachImage(e) {
    let tmpImage = arrFavs[e.target.id.substring(1)];
    tmpImage = tmpImage.substring(
      tmpImage.indexOf("|") + 1,
      tmpImage.indexOf("~")
    );
    saveFileSaleArtifact(tmpImage);
  }

  function uploadTheFile(cstrCategory, cstrArtType, selectedFiles) {
    let tempImage = { uploadedImage: selectedFiles[0] };
    const formData = new FormData();
    console.log(...formData);
    formData.append("file", tempImage.uploadedImage);
    formData.append("upload_preset", "uploadunsigned");
    formData.append("category", cstrCategory);
    saveArtifactImage(formData)
      .then(saveArtifact(cstrArtType, cstrCategory, selectedFiles[0].name))
      .catch((err) => console.error);
  }

  function handleFileChangeUP1(newFile) {
    uploadTheFile("Workorders", "Customer", newFile);
  }

  function handleFileChangeUP2(newFile) {
    uploadTheFile("Workorders", "Progress", newFile);
  }

  function ShowWorkorder() {
    let arrText = [];
    const carrT = [
      "Work Type",
      "Work Description",
      "Order Date",
      "Received Date",
      "Start Date",
      "Complete Date",
      "Target Date",
      "Quote Amount",
    ];
    const carrV = [
      "Worktype",
      "WorkDescription",
      "OrderDate",
      "ReceivedDate",
      "StartDate",
      "CompleteDate",
      "TargetDate",
      "QuoteAmount",
    ];
    for (let vint = 0; vint < 8; vint++) {
      arrText.push(
        <tr key={"a" + vint}>
          <td key={"b" + vint}>{carrT[vint]}</td>
          <td key={"c" + vint}>
            <input
              type="text"
              name={carrV[vint]}
              key={"d" + vint}
              value={work[carrV[vint]] || ""}
              onChange={handleInputChange}
            />
          </td>
        </tr>
      );
    }
    return arrText;
  }
  return (
    <>
      <form onSubmit={handleSubmit} id="oneWorkForm">
        <table id="oneWork">
          <thead></thead>
          <tbody>
            <tr id="woTop">
              <td>Customer</td>
              <td>{`${cust.FirstName} ${cust.LastName}`}</td>
            </tr>
            <tr>
              <td>Workorder ID</td>
              <td>{work.SaleID}</td>
            </tr>
            <tr>
              <td>Customer ID</td>
              <td>
                {work.CustomerID}
                <button type="button" id="newWOdate" onClick={addNextDate}>
                  Next Date
                </button>
              </td>
            </tr>
            {ShowWorkorder()}
            <tr>
              <td>Paid</td>
              <td>
                <input
                  type="checkbox"
                  name="Paid"
                  id="paid"
                  checked={work.Paid}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button className="custButton" type="Submit">
                  Save Changes to Workorder
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {images[0] && (
        <div className="ownLine">
          <h2 className="newStart">Pattern used...</h2>
        </div>
      )}
      {images[0] && (
        <div className="ownLine">
          <FindPattern />
        </div>
      )}
      {!images[0] && (
        <>
          <div id="faveHeader">
            &nbsp;&nbsp;&nbsp;Assign an available Favorite to this Workorder
          </div>
          <div id="grid-favorites">
            <DisplayFavorites />
          </div>
        </>
      )}
      {images[0] && (
        <>
          <div className="ownLine">
            <h2 className="newStart">Pictures from the Customer...</h2>
            &nbsp;&nbsp;&nbsp;
            <input
              type="file"
              name="imgNewC"
              id="imgNewC"
              accept="image/*"
              onChange={(e) => handleFileChangeUP1(e.target.files)}
            />
          </div>
          <div>
            <FindCustomerArt />
          </div>
          <div className="ownLine">
            <h2 className="newStart">Pictures from Deb...</h2>
            &nbsp;&nbsp;&nbsp;
            <input
              type="file"
              name="imgNewD"
              id="imgNewD"
              accept="image/*"
              onChange={(e) => handleFileChangeUP2(e.target.files)}
            />
          </div>
          <div>
            <FindProgressArt />
          </div>
        </>
      )}
    </>
  );
}

export { WorkOrderPage };
