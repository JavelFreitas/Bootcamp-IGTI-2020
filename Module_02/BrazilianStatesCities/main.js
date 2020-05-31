const fs = require('fs');
const express = require('express');
const app = express();



function readAplicationFiles() {
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let states = JSON.parse(data.toString());
        // console.log(states.length);


        fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Cidades.json', (err, data) => {
            if (err) throw err;

            let cities = JSON.parse(data.toString());

            states.forEach((state) => createStateFile(state, cities));
        });
    });

}


function createStateFile(state, cities) {
    const stateCities = cities.filter(city => city.Estado === state.ID);

    fs.writeFile(`Module_02/BrazilianStatesCities/EachStateFiles/${state.Sigla}.json`,
        JSON.stringify(stateCities, null, 4), (err) => {
            if (err) throw err;
            console.log('Deu certo');
        });
}

async function countStates() {
    let data = fs.readFileSync('Module_02/BrazilianStatesCities/Original_Files/Estados.json');

    let states = JSON.parse(data.toString());

    return states.length;
}

async function countCities(state){
    
    let data = fs.readFileSync(`Module_02/BrazilianStatesCities/EachStateFiles/${state}.json`);

    let cities = JSON.parse(data.toString());

    return cities.length;  
}

// console.log(countStates());
// console.log(countCities('CE'));




app.get('/buildFiles', (_, res) => {
    readAplicationFiles();
    res.end();
});

app.get('/totalOfStates', (_, res) => {
    countStates().then(
        (numberOfStates) => res.send(`${numberOfStates}`) 
    );
});

app.get('/numberOfCities/:state', (req, res) => {
    countCities(req.params.state).then(
        (totalCities) => res.send(`${totalCities}`)
    ); 
});




app.listen(3000, () => {
    console.log(`App listening onport 3000`);
}); 
