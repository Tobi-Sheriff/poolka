if (navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
		console.log(position);
        console.log('working');
        // const userLocation = document.querySelector('#userLocator');
        // const clickMe = document.querySelector('#clickMe');
        // clickMe.addEventListener('click', (e) => {
        //     e.preventDefault;
        //     userLocation.innerHTML = position.coords.latitude;
        //     console.log("working!!!")
        // })
	})
} else {
    console.log("not working");
}

// const successCallback = (position) => {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     console.log(latitude);
//     console.log(longitude);
//     console.log(position);
// };
// const errorCallback = (err) => {
//     console.log(err);
// };
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
// } else {
//     console.error('Geolocation is not supported by this browser.');
// }

// let autocomplete;
// function initAutocomplete() {
//     autocomplete = new google.maps.places.Autocomplete(
//         document.getElementById('autocomplete'),
//         {
//             types: ['transport'],
//             componentRestrictions: {'country' : ['NG']}
//             // fields: ['place_id', 'geometry', 'name']
//         }
//     );
// }



// function initAutocomplete() {
//     const autocomplete = new google.maps.places.Autocomplete(
//         document.getElementById('locationInput'),
//         { types: ['geocode'] }
//     );
// }
// window.onload = initAutocomplete;



// async function getAutocompleteSuggestions(input) {
//     try {
//         const response = await fetch(`/places-proxy?input=${encodeURIComponent(input)}`);
//         const data = await response.json();
//         console.log('Autocomplete Suggestions:', data);
//         // Process the suggestions as needed
//     } catch (error) {
//         console.error('Error fetching autocomplete suggestions:', error.message);
//     }
// }

// function initAutocomplete() {
//     const inputElement = document.getElementById('locationInput');
//     inputElement.addEventListener('input', () => {
//         const input = inputElement.value;
//         getAutocompleteSuggestions(input);
//     });
//     // Rest of your Autocomplete setup
// }
// initAutocomplete();
