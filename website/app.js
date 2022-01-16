/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
// Directives &units=imperial for Fahrenheit or &units=metric for celsius is added in our final URL formed for API calls.
const apiKey = '&appid=8352ebdbd0ef002753e1b61f4c02256f&units=imperial';
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
    const isValid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(document.getElementById('zip').value);
    if (isValid) {
        const newZip     =  document.getElementById('zip').value + ",us";
        const Feeling    =  document.getElementById('feelings').value;
        getZip(baseURL,newZip, apiKey)
        .then(function(data){
            const temp = data.main.temp;
            //console.log(temp);
            postData('/addHistory', {temperature: temp, feeling: Feeling, date:newDate})
            updateUI()
        })
    }
    else {
        alert('Please enter a valid zip first');
    }
}

/* Function to GET Web API Data*/
// GET Route II: Client Side
// There should be an asynchronous function to fetch the data from the app endpoint
// By Zip Code
// api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
// api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}
const getZip = async (baseURL, zip, key)=>{

    const res = await fetch(baseURL+zip+key)
    try {
        const data = await res.json();
        return data;
    }  catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

// /* Function to POST data */
const postData = async ( url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        //console.log(newData);
        return newData;
    }catch(error) {
        console.log("error", error);
    }
}

const updateUI = async () => {
    const request = await fetch('/ProjData');
    try{
        const allData = await request.json();
        //console.log(allData);
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temperature;
        document.getElementById('content').innerHTML = allData.feeling;

    }catch(error){
        console.log("error", error);
    }
}


