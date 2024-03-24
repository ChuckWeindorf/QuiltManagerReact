import { simpleDate } from "./common";

const cstrServer = import.meta.env.VITE_API;
const cstrAPIkey = import.meta.env.VITE_API_KEY;
const cobjHeader = {"qm-api-key": cstrAPIkey}; 

/**
 *
 * @returns The list of unique categories available in the Artifacts table
 */
async function fetchCategoryList() {
  try {
    //console.log(cstrServer);
    const response = await fetch(`${cstrServer}artifacts/categories`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {One selection from the list of unique categories} cstrCategory
 * @returns an array of artifacts available in the category folder on the site
 */
async function fetchArtifactList(cstrCategory) {
  try {
    const response = await fetch(`${cstrServer}artifacts/catList/${cstrCategory}`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {the SaleID key used to identify all images attached to one workorder} cintID
 * @returns An array of images connected to the workorder
 */
async function fetchArtifactListbyWorkorder(cintID) {
  try {
    //console.log("try to get WO " + cintID)
    const response = await fetch(`${cstrServer}sales_artifacts/workorder/${cintID}`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {Two keys - SalesID and ArtifactID are placed in a table to connect Workorders to specific images} objImage
 * @returns the inserted ID that is the new SalesArtifactID for one artifact on the workorder
 */
async function postSalesArtifact(objImage) {
  try {
    const objBody = JSON.stringify(objImage);
    const response = await fetch(`${cstrServer}sales_artifacts`, {
      method: "POST",
      body: objBody,
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The key to the ArtifactID for one image} cstrArtID
 * @returns The data related to the image including parameters to the path of the physical location
 */
async function fetchArtifact(cstrArtID) {
  try {
    let tmpPath = `${cstrServer}artifacts`;
    if (cstrArtID) {
      tmpPath += `/${cstrArtID}`;
    }
    const response = await fetch(tmpPath, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {A new image to be stored in the database with a path to the physical image} objImage
 * @returns the inserted ID that is the new ArtifactID in the artifacts table
 */
async function postArtifact(objArtifact) {
  try {
    const objBody = JSON.stringify(objArtifact);
    const response = await fetch(`${cstrServer}artifacts`, {
      method: "POST",
      body: objBody,
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The artifact fields to be update in the artifacts table} objArtifact
 * @returns none
 */
async function putArtifact(objArtifact) {
  try {
    const objBody = JSON.stringify(objArtifact);
    await fetch(`${cstrServer}artifacts/${objArtifact.ArtifactID}`, {
      method: "PUT",
      body: objBody,
      headers: cobjHeader
    });
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {This is the object for transferring the payload of the new image to Node} formData
 * @returns response
 */
async function saveArtifactImage(formData) {
  try {
    //console.log(...formData);
    const response = await fetch(`${cstrServer}artifacts/upload`, {
      method: "POST",
      body: formData,
      headers: cobjHeader
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @returns a list of all favorites send to the owner from guest accounts
 */
async function fetchFavorites() {
  try {
    const response = await fetch(`${cstrServer}favorites`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {Text field enetered by the guest on the site} cstrGuestName
 * @param {The category of the favorite image} cstrFileName
 * @param {The ArtifactID key of the favorite image} cintArtifactID
 * @returns
 */
async function postFavorite(cstrGuestName, cstrFileName, cintArtifactID) {
  try {
    const objBody = JSON.stringify({
      GuestName: cstrGuestName,
      CatFileName: cstrFileName,
      ArtifactID: cintArtifactID,
      CreateDate: simpleDate("", true),
    });
    await fetch(`${cstrServer}favorites`, {
      method: "POST",
      body: objBody,
      headers: cobjHeader
    });
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The FavoriteID of the link to the image that will be delete} cintFavID
 * @returns
 */
async function deleteFavorite(cintFavID) {
  try {
    await fetch(`${cstrServer}favorites/${cintFavID}`, {
      method: "DELETE",
      headers: cobjHeader
    });
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The CustomerID that is the filter to find all related workorders} cstrCustomerID
 * @returns An array of all workorders for this customer
 */
async function fetchWorkorders(cstrCustomerID) {
  let vstrPath = "";
  if (cstrCustomerID) vstrPath = `/customer/${cstrCustomerID}`;

  try {
    const response = await fetch(`${cstrServer}sales${vstrPath}`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The SaleID key for a unique workorder} cintSaleID
 * @returns one Workorder object in an array
 */
async function fetchOneWorkorder(cintSaleID) {
  try {
    const response = await fetch(`${cstrServer}sales/${cintSaleID}`, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The workorder fields to be updated} objWork
 * @returns
 */
async function putWorkorder(objWork) {
  try {
    const objBody = JSON.stringify(objWork);
    await fetch(`${cstrServer}sales/${objWork.SaleID}`, {
      method: "PUT",
      body: objBody,
      headers: cobjHeader
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 *
 * @param {The workorder object for all fields to be added on create} objWork
 * @returns The SaleID of the new record in the database
 */
async function postWorkorder(objWork) {
  try {
    const objBody = JSON.stringify(objWork);
    const response = await fetch(`${cstrServer}sales`, {
      method: "POST",
      body: objBody,
      headers: cobjHeader
    });
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 *
 * @param {The single customer key to retrieve} cstrCustID
 * @returns one customer object in an array
 */
async function fetchCustomers(cstrCustID) {
  try {
    let tmpPath = `${cstrServer}customers`;
    if (cstrCustID) {
      tmpPath += `/${cstrCustID}`;
    }
    const response = await fetch(tmpPath, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {Customer information to be updated in the database} objCust
 * @returns
 */
async function putCustomer(objCust) {
  try {
    const objBody = JSON.stringify(objCust);
    await fetch(`${cstrServer}customers/${objCust.CustomerID}`, {
      method: "PUT",
      body: objBody,
      headers: cobjHeader
    });
  } catch (err) {
    return err;
  }
}

/**
 *
 * @param {The fields for a new customer} objCust
 * @returns the new CustomerID
 */
async function postCustomer(objCust) {
  try {
    const objBody = JSON.stringify(objCust);
    const response = await fetch(`${cstrServer}customers`, {
      method: "POST",
      body: objBody,
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @returns The results of the API call for the seller category tree nodes for etsy
 */
async function fetchEtsyTaxonomy() {
  try {
    let tmpPath = `${cstrServer}etsytaxonomy`;
    //console.log(tmpPath);
    const response = await fetch(tmpPath, {
      method: "GET",
      headers: cobjHeader
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
}

/**
 *
 * @returns The results of the API call for the seller category tree nodes for etsy
 */
async function checkLogin(cobjParams) {
  try {
    let encParams = btoa(`${cobjParams.login}: ${cobjParams.password}`);
    //console.log(cobjParams);
    //console.log(encParams);
    const response = await fetch(`${cstrServer}login`, {
      method: "GET",
      headers: {'Authorization': encParams,
                'qm-api-key': cstrAPIkey}
    });
    const data = await response.json();
    return data;
  } catch (err) { console.log(err);
    return err;
  }
}

export {
  fetchCategoryList,
  fetchArtifactList,
  fetchArtifactListbyWorkorder,
  postSalesArtifact,
  postFavorite,
  fetchFavorites,
  deleteFavorite,
  fetchWorkorders,
  fetchOneWorkorder,
  postWorkorder,
  putWorkorder,
  fetchCustomers,
  putCustomer,
  postCustomer,
  postArtifact,
  putArtifact,
  fetchArtifact,
  saveArtifactImage,
  fetchEtsyTaxonomy,
  checkLogin
};
