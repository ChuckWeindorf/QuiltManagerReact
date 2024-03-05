


/*
//1. The direct approach

//RFC
import React from 'react'

export default function showCoolData() {

    useEffect(() => {
        //No async functions, no Promise wrapping or returning, just invoking the fetch
        //and immediately consuming it with .then chaining
        fetch(URL)
        .then((res) => res.json())
        .then((data) => {
            setStateData(data);
        });
    }, [])

  return (
    <div>examples</div>
  )
}

//==============================================================
//2A. Make the fetch it's own separate function

//RFC
import React from 'react'

export default function showCoolData() {

    function getCoolData() {
        return new Promise((res, rej) => {
            fetch(URL)
            .then((res) => res.json())
            //This still returns a promise, but instead of returning the response object,
            //it will return the actual data that you're hoping to get from the fetch
            //You've already consumed the first part of the promise, and now you just pass along
            //the second half of it
            .then((data) => res(data))
            .catch((err) => rej(err));
        });
    }

    useEffect(() => {
        //This returns a Promise object, so we still need to consume it
        getCoolData()
        .then(data => setStateData(data))
        .catch(err => console.error);
    }, [])

  return (
    <div>examples</div>
  )
}

//==============================================================
//2B. Make the fetch it's own separate function

//RFC
import React from 'react'

export default function showCoolData() {
    //Does exactly the same thing as the 2A example, just uses async/await syntax
    //It's converting the response object into the actual data before returning the data,
    //but it's still returning a Promise that holds the data. That's what the "async" keyword does -
    //it wraps the returned value inside of a Promise object
    async function getCoolData() {
        try {
            const response = await fetch(URL);
            const data = await response.json();
            return data;
        } catch (err){
            return err;
        }

    }

    useEffect(() => {
        //This returns a Promise object, so we still need to consume it, just like in the 2A example
        getCoolData()
        .then(data => setStateData(data))
        .catch(err => console.error);
    }, [])

  return (
    <div>examples</div>
  )
}
*/