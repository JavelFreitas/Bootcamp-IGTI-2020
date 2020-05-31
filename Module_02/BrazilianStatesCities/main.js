const fs = require('fs')



function readAplicationFiles(){
    fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Estados.json', (err, data) => {
        if (err) throw err;

        let  exemplo = JSON.parse(data.toString());
        console.log(exemplo);
        
        fs.readFile('Module_02/BrazilianStatesCities/Original_Files/Cidades.json', (err, data) => {
            if (err) throw err;

            let exemplo2 = JSON.parse(data.toString());

        });
    });

}

readAplicationFiles();