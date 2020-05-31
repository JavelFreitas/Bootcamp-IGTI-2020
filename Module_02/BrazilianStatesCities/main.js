const fs = require('fs')



function readAplicationFiles() {
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let states = JSON.parse(data.toString());
        console.log(states.length); 
        

        fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Cidades.json', (err, data) => {
            if (err) throw err;

            let cities = JSON.parse(data.toString());
            
            // states.forEach((state) => createStateFile(state, cities))
        });
    });

}


function createStateFile(state, cities) {
    let stateCities = cities.filter(city => { city.Estado === state.ID });

    fs.writeFile(`Module_02/BrazilianStatesCities/EachStateFiles/${state.Sigla}.json`,
        JSON.stringify(stateCities, null, 4), (err) => {
            if (err) throw err;
            console.log('Deu certo');
        });
}


readAplicationFiles();