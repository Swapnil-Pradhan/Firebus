var qrdata, adm;

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("User Data").doc(user.photoURL).get().then(ss => {
            if (ss.exists) {
                const span = document.getElementsByTagName("span");

                document.getElementById("nam").innerHTML = user.displayName;
                document.getElementById("dp").setAttribute("src", ss.data().dp);
                span[3].innerHTML = ss.data().Data[1];
                span[9].innerHTML = ss.data().Data[2];
                span[11].innerHTML = ss.data().Data[3];
                span[7].innerHTML = ss.data().Data[4];
                qrdata = JSON.stringify([user.photoURL, ss.data().Data[1]]);
                adm = user.photoURL;
                rldb.ref("Adm/"+user.photoURL).on("value", snap => {
                    var stat = snap.val();
                    if (stat[0]) {
                        span[1].innerHTML = "YES";
                        span[1].style.backgroundColor = "#15011f";
                    } else {
                        span[1].innerHTML = "NO";
                        span[1].style.backgroundColor = "orangered";
                    }
                    span[5].innerHTML = tim(stat[1]);
                });
                for (var i = 0; i < 9; i++) {
                    if (i % 2 != 0) {
                        const x = document.getElementsByTagName("span")[i];
                        x.style.fontWeight = "bold";
                        x.style.color = "#ffe3c6";
                    }
                }
            }
        });
    } else {
        alert("Sign in first!");
    }
});

function tim(time) {
    const date = new Date(time),
        hr = date.getHours(), min = date.getMinutes(),
        hours = hr.toString().padStart(2, '0'), mins = min.toString().padStart(2, '0');
    return `${hours}:${mins}`
}

function dqr() {;
fetch("https://api.qrserver.com/v1/create-qr-code/?size=1080x1080&data="+qrdata).then(response => response.blob()).then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "QR Code.jpg";
        a.click();
        URL.revokeObjectURL(a.href);
      }).catch(err => alert(err));
}