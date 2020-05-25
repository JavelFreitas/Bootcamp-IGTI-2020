let allUsers = [];
let filteredUsers = [];

window.addEventListener('load', start)


function start(){ //pegar todos os elementos html
    const inputFilter = document.querySelector("input#inputText");
    inputFilter.addEventListener("keyup", filterUsers);
    fetchUsers();
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

function filterUsers(event){
    if(event.key === "Enter") console.log(event);

    
}

function getStatistics(){
    let [male, female] = genderStatistics();
    // let agesSum, agesAverage = ageStatistics();
    
    console.log(male);
    console.log(female);
}

function genderStatistics(){
    let male = 0;
    let female = 0;
    console.log(filteredUsers);
    
    filteredUsers.forEach(user => {
        if(user.gender === 'female'){
            female++;
        }else if(user.gender === 'male'){
            male++;
        }
    });
    return [male ,female];
}