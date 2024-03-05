import { useEffect, useState } from 'react';
import { postArtifact, putArtifact, fetchArtifact, saveArtifactImage } from '../components/fetchRoutines';
import { useLocation } from 'react-router-dom';
import { simpleDate } from '../components/common';

function ArtifactPage()
{   
    const objArtifact = {ArtifactID: 0,
                     ArtType: "",
                     Category: "",
                     CreateDate: "",
                     ArtDescription: "",
                     FileName: ""
                    }
  
    let tempImage = {};

    //Use State
    const [artifact, setArtifact] = useState(objArtifact);
    const [imgPattern, setImgPattern] = useState();

    const location = useLocation();

    const { navState } = location.state;

    useEffect( () => {
        let intSlash = navState.indexOf("/");
        if (intSlash > -1) {
            let tmpID = navState.substring(intSlash + 1);
            let localCategory = navState.substring(0,intSlash);
           // console.log(tmpID, localCategory);
            retrieveArtifact(tmpID);
        } 
        else { //NavState has the category only but no artifact ID - create new
             createArtifact();                      
             }
        }, []);

        //Update the object on screen change
        const handleInputChange = (e) => {
           const { name, value } = e.target;
           setArtifact({ ...artifact, [name]: value });
           };

            function createArtifact()
                { 
                objArtifact.ArtType = "Pattern";
                objArtifact.Category = navState;
                objArtifact.CreateDate = simpleDate("", true);
                objArtifact.ArtDescription = "";
                objArtifact.FileName = "";
                postArtifact(objArtifact)
                        .then (data => {retrieveArtifact(data.insertId)})
                        .catch(console.error);
                }

            async function retrieveArtifact(cintID) 
                {
                fetchArtifact(cintID)
                        .then(data => {
                            data[0].CreateDate = simpleDate(data[0].CreateDate, false);
                            setArtifact(data[0]);
                            setImgPattern(`${import.meta.env.VITE_ARTIFACTPATH}/${data[0].Category}/${data[0].FileName}`);
                            })
                        .catch(err => console.error);
                };
            
            async function saveArtifact()
                {
                putArtifact(artifact)
                        .then()
                        .catch(err => console.error);
                }                

            function handleFileChange(selectedFiles) 
                {
                    tempImage = {uploadedImage: selectedFiles[0]};
                    const formData = new FormData();
                    formData.append('file', tempImage.uploadedImage);
                    formData.append('upload_preset','uploadunsigned');
                    formData.append('category', artifact.Category);
                    saveArtifactImage(formData)
                      .then()
                      .catch(err => console.error);
                    setArtifact({...artifact, ["FileName"]: selectedFiles[0].name});
                    setImgPattern(URL.createObjectURL(selectedFiles[0]));
                }
            
            // Save the artifact on submit
            function handleSubmit(e) {
                    e.preventDefault();
                    //Put fields back to database!
                    saveArtifact(); 
                    };
               
    return (
        <>
   <form onSubmit={handleSubmit}>
   <table id="oneArt">
    <thead>
    </thead>
    <tbody>
    <tr><td>ID</td><td>{artifact.ArtifactID}</td></tr>
    <tr><td>Type</td><td>{artifact.ArtType}</td></tr>
    <tr><td>Category</td><td>{artifact.Category}</td></tr>
    <tr><td>Date Created</td><td>{artifact.CreateDate}</td></tr>
    <tr><td>Description</td><td><input type="text" name="ArtDescription"
                              value={artifact.ArtDescription || ""} onChange={handleInputChange}/></td></tr>
    <tr><td>File Name</td><td>{artifact.FileName}</td></tr>
    <tr><td></td><td><button className="artButton" type="submit">Save Changes to Artifact</button></td></tr>
    </tbody>
    </table>
    </form>
    <form>
    <div><input type="file" name="imgNew" id="imgNew" accept="image/*" 
             onChange={(e) => handleFileChange(e.target.files)}/></div>
      {artifact.FileName && <div><img id="imgLimit" src={imgPattern} /></div>}
      </form>
        </>
    );
}
     // 
export { ArtifactPage };