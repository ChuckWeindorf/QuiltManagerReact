import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  fetchCategoryList,
  fetchArtifactList,
  postFavorite,
} from "../components/fetchRoutines";
import { guestMode, ConditionalMenu } from "../components/common";

function ArtifactsPage(props) {
  let [arrCats, setCatArray] = useState([]);
  let [arrImage, setArrImage] = useState([]);
  let [arrFavs, setArrFavs] = useState([]);
  let [cstrCategory, setcstrCategory] = useState("");
  let [cstrGuest, setcstrGuest] = useState("");
  let [vbolThanks, setvbolThanks] = useState(false);

  useEffect(() => {
    if (arrCats.length == 0) {
      fetchCategoryList()
        .then((data) => setCatArray(data.map((element) => element.category)))
        .catch((err) => console.error);
    }
  }, []);
  //-----Internal Function-----------------------------------------
  //Retrieve Image List of category for type Patterns
  async function fetchArtifacts(cstrCat) {
    setArrImage([]);
    setvbolThanks(false);
    setcstrCategory(cstrCat);
    let tmpArr = await fetchArtifactList(cstrCat);
    setArrImage(tmpArr);
  }
  //Present all images in the Category as <div> flowing within a container
  function ShowImages() {
    vbolThanks = false;
    return (
      <>
        {arrImage.map((image, index) => {
          return (
            <div key={`image${index}`} className="artifactChild">
              <img
                src={`${import.meta.env.VITE_ARTIFACTPATH}/${cstrCategory}/${
                  image.FileName
                }`}
                className="artifactImage"
              />
              <button
                key={index}
                id={index}
                className="artifactFAV"
                onClick={SaveFave}
              >
                FAVE!
              </button>
              {!guestMode() && (
                <NavLink
                  to="/artifact"
                  state={{ navState: `${image.Category}/${image.ArtifactID}` }}
                >
                  <button key={`u${index}`} className="artifactUpd">
                    Update
                  </button>
                </NavLink>
              )}
            </div>
          );
        })}
      </>
    );
  }
  //
  //
  //Retain one image as a favorite for this user in this session
  function SaveFave(buttonEvent) {
    setvbolThanks(false);
    const cstrFile = `${cstrCategory}/${
      arrImage[buttonEvent.target.id].FileName
    }|${arrImage[buttonEvent.target.id].ArtifactID}`;
    if (!arrFavs.includes(cstrFile)) {
      setArrFavs([...arrFavs, cstrFile]);
    }
  }

  //Create the HTML to show list of prior images
  function ShowFavorites() {
    if (arrFavs.length > 0) {
      return (
        <>
          {arrFavs.map((image, index) => {
            return (
              <div className="faveChild" key={index}>
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
                  onClick={TellDebbie}
                >
                  Tell Deb
                </button>
              </div>
            );
          })}
        </>
      );
    }
  }

  //POST to favorties table to notify Deb of a customer favorite design
  function TellDebbie(buttonEvent) {
    let tmpFav = arrFavs[buttonEvent.target.id.substring(1)];

    postFavorite(
      cstrGuest,
      tmpFav.substring(0, tmpFav.indexOf("|")),
      tmpFav.substring(tmpFav.indexOf("|") + 1)
    );
    setvbolThanks(true);
  }

  //Save the guest name for sending to Deb
  function SaveGuest(inputEvent) {
    setcstrGuest(inputEvent.target.value);
  }

  function checkCat() {
    if ((cstrCategory == "Select") | guestMode()) {
      return false;
    } else {
      return true;
    }
  }
  //---------------------------------------------------------------------------
  //big HTML render
  return (
    <>
      <ConditionalMenu />
      <div id="artifactCont">
        <h1>&nbsp;Browse Debbie's Pattern Catalog</h1>
        {!guestMode() && (
          <NavLink
            id="newPatt1"
            className="navType"
            to="/artifact"
            state={{ navState: cstrCategory }}
          >
            <button type="button" id="newPatt2">
              New Pattern in Category
            </button>
          </NavLink>
        )}
        <table id="artifactT">
          <tbody>
            <tr>
              <td id="artifactEntry">
                <label htmlFor="entName">Your name: </label>
                <input
                  type="text"
                  maxLength="20"
                  size="20"
                  id="entName"
                  onChange={SaveGuest}
                ></input>
                <p>
                  Select a Category:{" "}
                  <select
                    id="categorySel"
                    name="categorySel"
                    onChange={(e) => {
                      fetchArtifacts(e.target.value);
                    }}
                  >
                    <option value="Select">Select</option>
                    {arrCats.map((element, index) => {
                      return (
                        <option key={element + index} value={element}>
                          {element}
                        </option>
                      );
                    })}
                  </select>
                </p>
              </td>
            </tr>

            {arrImage[0] && (
              <tr>
                <td>
                  &nbsp;&nbsp;&nbsp;Click on a FAVE! button to save favorites.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {vbolThanks && (
        <div id="thanks">&nbsp;Thanks, your favorite has been sent.</div>
      )}
      {arrFavs[0] && (
        <div id="faveHeader">
          &nbsp;&nbsp;&nbsp;Click on Tell Deb to send to the Quilt Lady.
        </div>
      )}
      <div id="grid-favorites">
        <ShowFavorites />
      </div>
      {arrImage[0] && (
        <div id="grid-artifacts">
          <ShowImages />
        </div>
      )}
    </>
  );
}

export { ArtifactsPage };
