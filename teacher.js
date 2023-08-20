const grade = JSON.parse(localStorage.class).grade, sec = JSON.parse(localStorage.class).sec;
document.getElementsByTagName("header")[0].innerHTML = grade + " " + sec;

db.collection("Classes").doc(grade).collection(sec).get().then(querysnap => {
    querysnap.forEach(doc => {
        const key = Object.keys(doc.data())[0], dta = doc.data()[key],
            li = document.createElement("li");



        li.innerHTML = `<div><a href="tel:${dta[2]}">${dta[0]}</a><span>${dta[1]}</span><span id="${key}"></span></div>`;
        document.getElementsByTagName("p")[0].appendChild(li);
        rldb.ref("Adm/" + key).on("value", stat => {
            const id = document.getElementById(key), s = stat.val();
            id.removeAttribute("class");
            id.classList.add(s[1]);
            id.innerHTML = s[0] ? 'YES' : 'NO';
            id.style.background = s[0] ? "yellowgreen" : "orangered";
        });

    });

    document.querySelectorAll("li div>*:nth-child(3)").forEach(hi => {
        hi.addEventListener("click", elm => {
            console.log(Number(elm.target.classList))
            alert(`${(d = new Date(Number(elm.target.classList))).getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`);
        });
    });
});

