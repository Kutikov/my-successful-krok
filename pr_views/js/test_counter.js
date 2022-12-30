function readTests(){
    fetch("https://kutikov.github.io/my-successful-krok/main-list.json")
        .then((response) => {
            return response.json();
        })
        .then((data)=> {
            let tests = 3775 + 3982 + 4000 + 3747 + 2944 + 1997;
            let packages = 6;
            for(let i = 0; i < data.length; i++){
                tests = tests + Number(data[i].author.split('#&')[1]);
                packages++;
            }
            fetch("https://kutikov.github.io/my-successful-krok/premium-list.json")
                .then((response2) => {
                    return response2.json();
                })
                .then((data2)=> {
                    for(let j = 0; j < data2.length; j++){
                        tests = tests + Number(data2[j].author.split('#&')[1]);
                        packages++;
                    }
                    document.getElementById('repSt').innerText = tests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    document.getElementById('packs').innerText = packages;
                });
        });
}