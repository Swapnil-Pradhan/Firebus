const i = document.getElementsByTagName("i"),
    start = document.getElementsByTagName("font"), scn = document.getElementsByClassName("scanner")[0], field = document.getElementsByTagName("fieldset"), legend = document.getElementsByTagName("b");

function check(x) {
    db.collection("Passwords").doc(x.buno).get().then(doc => {
        if (doc.exists && doc.data().pass == x.pass) {
            document.getElementsByTagName("header")[0].innerHTML += x.buno;
            let scanner = new Instascan.Scanner({ video: document.getElementsByTagName("video")[0] });
            var noc;
            db.collection("Buses").doc(x.buno).get().then(doc => {
                rldb.ref("Drop/" + x.buno).once("value", sn => {
                    if (new Date().getHours() < 11) {
                        field[2].style.display = "none";
                        field[3].style.display = "none";
                        if (sn.val() != null) {
                            legend[0].innerHTML = sn.val().length;
                            sn.val().forEach(elm => {
                                const daat = doc.data()[elm],
                                    naam = document.createElement("a"), clas = document.createElement("span");
                                naam.innerHTML = doc.data()[elm][0];
                                naam.href = `tel:${daat[4]}`
                                naam.classList.add(elm);
                                clas.classList.add(elm);
                                clas.innerHTML = `${daat[1]} ${daat[2]}`;
                                field[0].appendChild(naam);
                                field[0].appendChild(clas);
                            });
                        } else {
                            legend[0].innerHTML = 0;
                            start[1].style.display = "none";
                        }

                        start[1].style.display = "block";
                    } else {
                        field[0].style.display = "none";


                        rldb.ref("Drop/" + x.buno).on("value", g => {
                            if (g.val() == null) {
                                console.log(345678)
                                noc = 0;
                                start[1].style.display = "block";
                                start[0].style.display = "block";
                                field[1].style.display = "block";
                                field[2].style.display = "none";
                            } else {
                                noc = g.val().length;
                            }
                            legend[1].innerHTML = noc;
                        });
                        if (sn.val() != null) {
                            sn.val().forEach(elm => {
                                const daat = doc.data()[elm],
                                    naam = document.createElement("a"), clas = document.createElement("span");
                                naam.innerHTML = doc.data()[elm][0];
                                naam.href = `tel:${daat[4]}`
                                naam.classList.add(elm);
                                clas.classList.add(elm);
                                clas.innerHTML = `${daat[1]} ${daat[2]}`;
                                field[2].appendChild(naam);
                                field[2].appendChild(clas);
                            });
                       
                        }
                        for (const key in doc.data()) {
                            console.log(key)
                            rldb.ref("Adm/" + key).once("value", f => f.val()[0] ? i[1].innerHTML = Number(i[1].innerHTML) + 1 : undefined);
                        }
                    }
                });
            });


            scanner.addListener("scan", cont => {
                const con = JSON.parse(cont);
                rldb.ref("Adm/" + con[1]).once("value").then(sna => {
                    const snap = sna.val();
                    db.collection("Buses").doc(x.buno).get().then(doc => {
                        if (doc.exists && doc.data().hasOwnProperty(con[1])) {
                            const name = doc.data()[String(con[1])][0];
                            rldb.ref("Drop").once("value", nap => {
                                if (new Date().getHours() < 11) {
                                    start[1].style.display = "block";
                                    if (snap[0] && snap[1] < Date.now()) {
                                        dialog(`${name} is already in bus`, "orangered");
                                    } else {
                                        rldb.ref("Adm/" + con[1]).set([true, Date.now()]);
                                        const dd = nap.val() || {};
                                        !dd.hasOwnProperty(x.buno) ? dd[x.buno] = [] : undefined;
                                        dd[x.buno].push(con[1]);
                                        rldb.ref("Drop").set(dd).then(() => {
                                            dialog(`${name} entered!`, "yellowgreen");
                                            legend[0].innerHTML = Number(legend[0].innerHTML) + 1;
                                            let p = con[1];
                                            const daat = doc.data()[p],
                                                naam = document.createElement("a"), clas = document.createElement("span");
                                            naam.innerHTML = doc.data()[p][0];
                                            naam.href = `tel:${daat[4]}`
                                            naam.classList.add(p);
                                            clas.classList.add(p);
                                            clas.innerHTML = `${daat[1]} ${daat[2]}`;
                                            field[0].appendChild(naam);
                                            field[0].appendChild(clas);
                                        }).catch(err => console.log(err));
                                    }
                                } else {
                                    if (noc == 0 || noc == undefined || noc == null) {
                                        start[1].display = "block";
                                        rldb.ref("Adm/" + con[1]).set([false, Date.now()]).then(() => dialog(`${name} left the bus.`, "orangered"));
                                    } else if (snap[0]) { dialog(`${name} can't leave now. ${noc} student${noc == 1 ? " is" : "s are"} yet to come`, "orangered") } else {
                                        rldb.ref("Adm/" + con[1]).set([true, Date.now()]).then(() => {
                                            console.log([nap.val()[x.buno]])
                                            rldb.ref("Drop/" + x.buno).set(nap.val()[x.buno].filter(item => item !== con[1])).then(() => {
                                                dialog(`${name} entered!`, "yellowgreen");
                                                i[1].innerHTML = Number([1].innerHTML) + 1;
                                                document.querySelector(`.${String(con[1])}`).forEach(e => e.remove());
                                            });
                                        });
                                    }
                                }
                            });
                        } else {
                            dialog(`You're bus no. is ${con[0]}and not ${x.buno}`, "gold");
                        }
                    });
                }).catch(err => alert(err));
            });
            start[0].addEventListener("click", () => {

                Instascan.Camera.getCameras().then(function (cameras) {
                    if (cameras.length > 0) {
                        scanner.start(cameras[0]);
                        scn.classList.add("activa");
                        cam = true;
                    } else { alert("No cameras found.") }
                });
                scn.addEventListener("click", () => {
                    scn.classList.remove("activa");
                    scanner.stop();
                });
            });
        } else {
            alert("INVALID CREDINTALS!!");
        }
        document.getElementsByTagName("font")[1].addEventListener("click", () => {
            if (confirm("Are you sure you want to mark all the students out of bus?")) {
                db.collection("Buses").doc(x.buno).get().then(d => {
                    for (const key in d.data()) {
                        rldb.ref("Adm/" + key).once("value", f => f.val()[0] ? rldb.ref("Adm/" + key).set([false, Date.now()]) : undefined);
                    }
                    document.getElementById("btns").style.scale = 0;
                    i[0].innerHTML = Number(i[1].innerHTML) + Number(i[0].innerHTML);
                    i[1].innerHTML = 0;
                });
            }
        });

    });
}

function dialog(x, y) {
    const info = document.createElement("span");
    info.innerHTML = x;
    info.classList.add("info");
    document.getElementsByClassName("scanner")[0].appendChild(info);
    document.getElementsByClassName("info")[0].style.backgroundColor = y;
    setTimeout(() => { info.remove() }, 4000);
}