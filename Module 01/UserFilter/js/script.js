let allUsers = [];
let filteredUsers = [];

let inputFilter = 0;
let buttonFilter = 0;


window.addEventListener('load', start)


function start(){ //pegar todos os elementos html
    inputFilter = document.querySelector("input#inputText");
    buttonFilter = document.querySelector("button#inputButton");
    console.log(buttonFilter);
    
    inputFilter.addEventListener('keyup', handleFilterEvent);
    buttonFilter.addEventListener('click', handleFilterEvent);
    // fetchUsers();
}


async function fetchUsers(){

    let userData = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'); 
    let json = await userData.json();
    json = json.results;

    allUsers = json.map(user => {
        const {name, picture, dob, gender} = user;
        return {
            firstName: name.first,
            lastName: name.last,
            profilePicture: picture.thumbnail,
            age: dob.age,
            gender
        };
    });

    filteredUsers = allUsers;
    getStatistics();
}

function handleFilterEvent(event){
    if(event.key === 'Enter' || event.type === 'click'){
        console.log(event);
        
        filterUsers(inputFilter.value);

    }

    
}

function filterUsers(textInput){
    console.log(textInput);
    
}


function getStatistics(){

    const [male, female] = genderStatistics();
    const [agesSum, agesAverage] = ageStatistics();
    
    // console.log(male);
    // console.log(female);
    // console.log(agesSum, agesAverage);
    return {male, female, agesSum, agesAverage};
}

function genderStatistics(){
    let male = 0;
    let female = 0;
    // console.log(filteredUsers);
    
    filteredUsers.forEach(user => {
        if(user.gender === 'female'){
            female++;
        }else if(user.gender === 'male'){
            male++;
        }
    });
    return [male ,female];
}

function ageStatistics(){
    let acc = 0;
    const agesSum = filteredUsers.reduce((acc, cur) => {
        return acc += cur.age;
    }, 0);

    const agesAverage = agesSum/filteredUsers.length;
    
    return [agesSum, agesAverage];
}