let allUsers = [];
let filteredUsers = [];

let inputFilter = 0;
let buttonFilter = 0;
let divInfoFiltered = 0;
let divUserFiltered = 0;

let maleQuantity = 0;
let femaleQuantity = 0;
let filteredAgesSum = 0;
let filteredAverageAge = 0;

window.addEventListener('load', start)


function start() {
    inputFilter = document.querySelector("input#inputText");
    buttonFilter = document.querySelector("button#inputButton");
    divUserFiltered = document.querySelector("div#userFiltered");
    divInfoFiltered = document.querySelector("div#infoFiltered");

    inputFilter.addEventListener('keyup', handleFilterEvent);
    buttonFilter.addEventListener('click', handleFilterEvent);

    fetchUsers();
}

async function fetchUsers() {

    let userData = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    let json = await userData.json();
    json = json.results;

    allUsers = json.map(user => {
        const { name, picture, dob, gender } = user;
        return {
            firstName: name.first,
            lastName: name.last,
            fullname: `${name.first} ${name.last}`,
            profilePicture: picture.thumbnail,
            age: dob.age,
            gender
        };
    });

    allUsers.sort((a, b) => {
        return a.fullname.localeCompare(b.fullname);
    });

    filteredUsers = allUsers;
    getStatistics();
}

function handleFilterEvent(event) {
    if (event.key === 'Enter' || event.type === 'click') {

        filterUsers(inputFilter.value);
        getStatistics();
        console.log(filteredUsers);

        renderFilteredUsers();


    }


}

function renderFilteredUsers() {
    let usersQtt = filteredUsers.length;

    if(usersQtt === 0){
        divUserFiltered.innerHTML = `<div>
            <h2>Nenhum usuário filtrado</h2>
        </div>`;
        return;
    }


    let usersHTML = `<div class='numberFiltered'> <h3>${usersQtt} usuário(s) encontrado(s).</h3></div>`

    usersHTML += `<div class='allFilteredUsers'>`;
    filteredUsers.forEach((user) => {
        usersHTML += `
        <div class='userProfileFullname'>
            <div class='userProfile'>
                <img src='${user.profilePicture}'>
            </div> 
            <div class='userFullname'>
                <p>${user.fullname} , ${user.age} ano(s)</p>
            </div>
        </div>`
    });
    usersHTML += `</div>`;

    divUserFiltered.innerHTML = usersHTML;
}


function filterUsers(textInput) {

    let textInputLower = textInput.toLowerCase();

    filteredUsers = allUsers.filter(user => {
        return (user.fullname.toLowerCase().indexOf(textInputLower) !== -1)
    });
}

function getStatistics() {

    [maleQuantity, femaleQuantity] = genderStatistics();
    [filteredAgesSum, filteredAverageAge] = ageStatistics();

}

function genderStatistics() {
    let male = 0;
    let female = 0;

    filteredUsers.forEach(user => {
        if (user.gender === 'female') {
            female++;
        } else if (user.gender === 'male') {
            male++;
        }
    });
    return [male, female];
}

function ageStatistics() {
    let acc = 0;
    const agesSum = filteredUsers.reduce((acc, cur) => {
        return acc += cur.age;
    }, 0);

    let average = agesSum / filteredUsers.length;

    const agesAverage = parseFloat(average.toFixed(2));

    return [agesSum, agesAverage];
}

