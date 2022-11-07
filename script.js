let container=document.querySelector(".container");
let inputbox=container.querySelector(".input-part");
let inputtxt=inputbox.querySelector(".input-info");
let inputfield=container.querySelector("input");
let getloc=inputbox.querySelector("button");
let icon=container.querySelector("img");
let weatherdet=container.querySelector(".main");
let backbtn=container.querySelector("h1>i");

let api;


inputfield.addEventListener('keyup',(e)=>{
    if(e.key=="Enter" && e.target.value!=''){
       // console.log("Done!")
        requestApi(e.target.value);
    }

})

getloc.addEventListener('click',()=>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }



});


function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
   // api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=your_api_key`;
    getdata(latitude,longitude);
}

function onError(error){
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}



function requestApi(city){
    inputtxt.innerHTML="Getting weather details......";
    inputtxt.classList.add("pending");


    let apikey='240cb8498c555780d8fbd4d07f10ae24';
    let geo=`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&units=metric&appid=240cb8498c555780d8fbd4d07f10ae24`;
    fetch(geo).then(req=>req.json()).then((res)=>{
        let lon=res[0].lon;
        let lat=res[0].lat;
        getdata(lat,lon);
    }).catch(()=>{
        inputtxt.innerText = "Something went wrong";
        inputtxt.classList.replace("pending", "error");

    }); 
}
function getdata(lat,lon){
    inputtxt.innerHTML="Getting weather details......";
    inputtxt.classList.add("pending");
    api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=240cb8498c555780d8fbd4d07f10ae24`;
    fetch(api).then((req)=>req.json()).then((res)=>cleaner(res)).catch(()=>{
        inputtxt.innerText = "Something went wrong";
        inputtxt.classList.replace("pending", "error");

    });

}
function cleaner(data){
    if(data.cod=='404'){
       
        inputtxt.classList.replace("pending", "error");
        inputTxt.innerText = `${inputfield.value} isn't a valid city name`;

    }
    else{
        

        const city = data.name;
        const country = data.sys.country;
        const {description, id} = data.weather[0];
        const {temp, feels_like, humidity} = data.main;


        if(id == 800){
            icon.src = "weather-app-icons/Weather Icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            icon.src = "weather-app-icons/Weather Icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            icon.src = "weather-app-icons/Weather Icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            icon.src = "weather-app-icons/Weather Icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            icon.src = "weather-app-icons/Weather Icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            icon.src = "weather-app-icons/Weather Icons/rain.svg";
        }


        weatherdet.querySelector(".temp .numb").innerText=Math.floor(temp);
        weatherdet.querySelector(".weather").innerText=description;
        weatherdet.querySelector(".location").innerText=`${city},${country}`;
        weatherdet.querySelector(".bottom .numb-2").innerText=Math.floor(temp);
        weatherdet.querySelector(".bottom .numb").innerText=`${humidity}%`;
        inputtxt.classList.remove('pending','error');
        container.classList.add("active");

    }

}

backbtn.addEventListener('click',(e)=>{
    console.log(e.target);
    container.querySelector("input").value="";
    

    container.classList.remove("active");
})
