import { useState, useEffect } from 'react';
import { fetchFavorites, deleteFavorite } from '../components/fetchRoutines';
import { simpleDate } from "../components/common";

function FavoritesPage(props) {

   let [arrFavs, setArrFavs] = useState([]);
    useEffect(() => { retrieveFavorites();
       }, []);

                //Fill the favorites array from the database
                async function retrieveFavorites() {
                  //console.log("getting favorites now");
                  await fetchFavorites()
                  .then(data => setArrFavs(data.map(element => element)))
                  .catch(err => console.error);
                };
                //place favorites in the table
                function ShowFaves()
                   {
                        return (
                        <>
                          {arrFavs.map((image, index) => {
                             return(<div className="favOne" key={`d${index}`}>
                                    <div className="favName"><p className="favHigh">{image.GuestName}&nbsp;&nbsp;{simpleDate(image.CreateDate,true)}</p></div>
                                    <img src={`${import.meta.env.VITE_ARTIFACTPATH}/${image.CatFileName}`} className="artifactImage" key={"i" + index}/>
                                    <button key={"f" + index} id={"f" + image.FavoriteID} className="favDelete" onClick={DeleteFave}>delete</button>
                                    <div className="favFile"><p className="favHigh">{image.CatFileName}</p></div>
                                    </div>
                                    );
                           })}
                        </>)
                   };
                //Retain one image as a favorite for this user in this session
                function DeleteFave(buttonEvent)
                   { 
                     const cintID = buttonEvent.target.id.substring(1);
                     deleteFavorite(cintID);
                     retrieveFavorites();
                   }
                //---------------------------------------------------------------------------
    //big HTML render
   // console.log("screen refresh here", arrFavs);
    return (
    <>
     <h1>List of Guest Favorites</h1>
     <div className="favCont">
      {ShowFaves()}  
      </div>
    </>
  )
}

export { FavoritesPage } ;
//