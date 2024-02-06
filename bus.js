const pr = document.getElementById("pr"), lr = document.getElementById("lr"), or = document.getElementById("or"),
    pl = document.getElementById("pl"), ll = document.getElementById("ll"), ol = document.getElementById("ol"),
    codin = document.getElementById("codin"), cod = document.getElementById("cod"),
    qrdt = document.getElementById("qrdt"), orf = document.getElementById("or"),
    condf = document.getElementById("condf"), ps = document.getElementById("ps"),
    appVerifier = new firebase.auth.RecaptchaVerifier('ultppa', {
        'size': 'invisible',
        'callback': (response) => {
            onSignInSubmit();
        }
    });

auth.useDeviceLanguage();

var userd, sel;

or.addEventListener("submit", () => {
    userd = Object.fromEntries(new FormData(or));
    rldb.ref("ADM/" + userd.adm).once("value", ss => {
        console.log(ss.val())
        if (ss.val()) {
            alert("User already exists!");
            reg("pl");
            ol.reset();
        } else {
            auth.signInWithPhoneNumber(document.getElementById("ppa").value, appVerifier).then((confirmationResult) => {
                console.log(JSON.stringify(confirmationResult));
                window.confirmationResult = confirmationResult;
                otp(confirmationResult);
            }).catch((err) => {
                alert(err.message);
                grecaptcha.reset(window.recaptchaWidgetId);
                window.recaptchaVerifier.render().then(function (widgetId) {
                    grecaptcha.reset(widgetId);
                });
            });
        }
    });
});

function otp(cnf) {
    updl("OTP Verification");
    document.querySelectorAll("fieldset>form").forEach(x => {
        x.style.height = "0";
    });
    document.querySelectorAll("fieldset:not(#" + sel + ")").forEach(x => {
        x.style.scale = "0";
        setTimeout(() => {
            x.style.display = "none";
        }, 500);
    });
    document.querySelector("form:nth-child(3)").style.height = "9ch";
    cod.addEventListener("submit", () => {
        cnf.confirm(codin.value).then((res) => {
            db.collection("Buses").doc(userd.busno).set({
                [userd.adm]: [userd.name, userd.grade, userd.sec, Number(userd.roll), userd.phone]
            }, { merge: true });

            db.collection("Classes").doc(userd.grade).collection(userd.sec).doc(userd.roll).set({
                [userd.adm]: [userd.name, Number(userd.busno), userd.phone]
            }, { merge: true });

            db.collection("User Data").doc(userd.adm).set({
                "Data": [Number(userd.adm), Number(userd.busno), userd.grade, userd.sec, Number(userd.roll), userd.phone],
                "dp": "dp.svg"
            }, { merge: true });

            rldb.ref("Adm").child(userd.adm).set([false, Date.now()]);


            auth.currentUser.updateProfile({
                displayName: userd.name,
                photoURL: userd.adm
            }).then(() => {
                cod.style.scale = "0";
                setTimeout(() => {
                    cod.style.display = "none";
                }, 500);
                const qrdata = "https://api.qrserver.com/v1/create-qr-code/?size=1080x1080&data=" + JSON.stringify([userd.busno, userd.adm].map(Number));
                updl("Here's your QR Code!");
                qrdt.src = qrdata;
                qrdt.classList.add("qrdto");
                fetch(qrdata).then(response => response.blob()).then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = "QR Code.jpg";
                    a.click();
                    URL.revokeObjectURL(a.href);
                }).catch(err => alert(err));
                pr.style.height = "350px";
            });
        }).catch((err) => {
            alert(err);
            codin.value = null;
            codin.placeholder = "Re-enter OTP";
        });
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        location.href = "student.htm";
    }
});

function lrg(id) {
    document.getElementById("alogin").classList.add("inv");
    document.getElementsByClassName(id)[0].style.scale = "1";
}

function updl(txt) {
    lr.innerHTML = txt;
    lr.style.width = txt.length + "ch";
}

document.querySelectorAll("#busno").forEach(b => {
    for (let i = 1; i < 37; i++) {
        const bus = document.createElement("option");
        bus.value = i;
        bus.innerHTML = i;
        b.appendChild(bus)
    }
});

function reg(id) {
    sel = id;
    eval(id).focus();
    if (id == "pr") {
        pr.classList.add("openf");
        lr.classList.add("openl");
        or.classList.add("openfo");
        pl.removeAttribute("class");
        ll.removeAttribute("class");
        ol.removeAttribute("class");
    } else {
        pl.classList.add("openf");
        ll.classList.add("openl");
        ol.classList.add("openfo");
        pr.removeAttribute("class");
        lr.removeAttribute("class");
        or.removeAttribute("class");
    }
}

condf.addEventListener("submit", () => {
    const q = Object.fromEntries(new FormData(condf))
    db.collection("Passwords").doc(q.buno).get().then(doc => {
        if (doc.exists && doc.data().pass == Number(q.pass)) {
            localStorage.setItem("dta", JSON.stringify(q));
            location.href = "bus.htm";
        } else {
            alert("Wrong password!!");
            ps.value = null;
            ps.placeholder = "Re-enter password!";
        }
    });
});