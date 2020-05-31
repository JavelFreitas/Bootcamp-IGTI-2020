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

function returnJSON(data) {
    return JSON.parse(data.toString());
}

async function countStates() {
    let allStates = fs.readFileSync('Module_02/BrazilianStatesCities/Original_Files/Estados.json');

    return returnJSON(allStates).length;
}

async function countCities(state) {
    let cities = fs.readFileSync(`Module_02/BrazilianStatesCities/EachStateFiles/${state}.json`);

    return returnJSON(cities).length;
}

async function getCitiesByState(state, id){
    let cities = fs.readFileSync(`Module_02/BrazilianStatesCities/EachStateFiles/${state}.json`);
    
    cities = returnJSON(cities);
    let orderedCities = orderByNameLength(cities);
    if(id == 'biggest'){
        orderedCities.reverse();
    }
    
    orderedCities = orderByNameLengthAlphabetical(orderedCities);
    // console.log(state);
    // console.log(orderedCities);
    
    
    return orderedCities[0];
}

function orderByNameLengthAlphabetical(allNames) {
    return allNames.sort((a, b) => {
        if (a.Nome.length == b.Nome.length) return a.Nome.localeCompare(b.Nome);
        return 0;
    });
}

function orderByNameLength(allNames) {
    return allNames.sort((a, b) => {
        if (a.Nome.length < b.Nome.length) return -1;
        if (a.Nome.length > b.Nome.length) return 1;
        return 0;
    });
}

function orderByTotalCities(allStates) {
    return allStates.sort((a, b) => {
        if (a.totalCities < b.totalCities) return -1;
        if (a.totalCities > b.totalCities) return 1;
        return 0;
    })

}

async function numberOfCitiesByStates(req, res) {
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let states = returnJSON(data);
        console.log(states);

        let numberOfCitiesByState = states.map(async (state) => {
            return countCities(state.Sigla).then(number => {
                return { state: `${state.Sigla}`, totalCities: number }
            });

        });

        Promise.all(numberOfCitiesByState).then((arrStates => {
            let orderedStates = orderByTotalCities(arrStates);
            if(req.params.id == 'most'){
                
                orderedStates.reverse();
                orderedStates.splice(5);
                console.log(orderedStates);
            }else if(req.params.id == 'less'){
                orderedStates.splice(5);
            }
            console.log(orderedStates.length);
            console.log(orderedStates);
            
            let totalNumber = 0;
            orderedStates.forEach(state => {
                totalNumber += state.totalCities;
            })

            
            console.log(`summed cities : ${totalNumber}`);
            console.log(orderedStates);

            res.send(orderedStates);
        }));
    });
}

function namesOfCitiesByState(req, res) {
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let states = returnJSON(data);
        
        let nameOfCitiesByState = states.map(async (state) => {
            return getCitiesByState(state.Sigla, req.params.id).then(cities => {
                return { city: `${cities.Nome}`, state: `${state.Sigla}` }
            });
            
        });
        Promise.all(nameOfCitiesByState).then(arrCities => {
            console.log(arrCities);

            res.send(arrCities);
        });
    });
}

function orderByCityLength(allNames) {
    return allNames.sort((a, b) => {
        if (a.city.length < b.city.length) return -1;
        if (a.city.length > b.city.length) return 1;
        return 0;
    });
}

function orderByCityLengthAlphabetical(allNames) {
    return allNames.sort((a, b) => {
        if (a.city.length == b.city.length) return a.city.localeCompare(b.city);
        return 0;
    });
}

function biggestSmallestName(req, res) {
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let states = returnJSON(data);
        
        let nameOfCitiesByState = states.map(async (state) => {
            return getCitiesByState(state.Sigla, req.params.id).then(cities => {
                return { city: `${cities.Nome}`,len: `${cities.Nome.length}` , state: `${state.Sigla}` }
            });
            
        });
        Promise.all(nameOfCitiesByState).then(arrCities => {
            arrCities = orderByCityLength(arrCities);
            console.log(arrCities);

            arrCities = orderByCityLengthAlphabetical(arrCities);


            if(req.params.id == 'biggest'){
                arrCities.reverse();
            }

            console.log(arrCities);

            res.send(arrCities[0]);
        });
    });
}


// console.log(countStates());
// countCities('CE').then(console.log);
// let a = getCitiesByState('CE', 'biggest');
// console.log(a);




app.get('/lastQuestion/:id', (req, res) => { // 7:biggest, 8:smallest
    biggestSmallestName(req, res);
})

app.get('/citiesByState/(:id)?', (req, res) => {// 3:most, 4:less, add:all.
    numberOfCitiesByStates(req, res);
});

app.get('/nameOfCities/:id', (req, res) => {// 5:biggest, 6:smallest
    namesOfCitiesByState(req, res);
})

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
