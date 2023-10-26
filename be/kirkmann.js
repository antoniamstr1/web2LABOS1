
function kirkman(n) {

    function kirkman_pairing(n, rd) {

        if (n % 2 !== 0) {
            n += 1;
        }
        let idex = [rd, rd];
        let pair = [];

        for (let i = 0; i < n / 2; i++) {

            if (idex[0] === idex[1]) {
                pair.push([idex[0], n]);
            } else {
                pair.push(idex);
            }


            idex = [idex[0] - 1, idex[1] + 1];


            if (idex[0] < 1) {
                idex[0] = n - 1;
            }

            if (idex[1] > n - 1) {
                idex[1] = 1;
            }
        }

        return pair;
    }

    let neparan = new Boolean(false);

    if (n % 2 !== 0) {
        n++;
        neparan = true
    }
    kolo_list = []
    for (let i = 1; i < n; i++) {
        let rezultat = kirkman_pairing(n, i);
        for (let j = 0; j < rezultat.length; j++) {
            if (rezultat[j].includes(n) && neparan === true) {

                delete rezultat[j];
            }
        }
        kolo_list.push(rezultat)
    }

    return kolo_list;
}


