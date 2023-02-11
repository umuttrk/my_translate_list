let user_signed_in = false;

function is_user_signed_in() {
    console.log('test');
    return new Promise(resolve => {
        chrome.storage.local.get(['userStatus', 'email'], function (response) {
            console.log(response);
            if (chrome.runtime.lastError) resolve({ userStatus: false, email: {} });
            resolve(
                response.userStatus === undefined ?
                    { userStatus: false, email: {} } :
                    { userStatus: response.userStatus, email: response.email }
            )
        })
    })
}


function change_user_status(signIn, userInfo) {
    if (signIn) {
        //fetch the localhost:300/login
        return fetch('http://localhost:3000/login', {
            method: 'GET',
            headers: {
                'type': 'login',
                'Authorization': 'Basic ' + btoa(`${userInfo.email}:${userInfo.pass}`)
            },
        }).then(res => {
            return new Promise(resolve => {
                if (res.status !== 200) resolve('fail');
                chrome.storage.local.set({ userStatus: signIn, email: userInfo.email }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                    user_signed_in = signIn;
                    resolve('success');
                });
            });
        }).catch(err => console.log(err));
    } else if (!signIn) {
        return new Promise(resolve => {
            chrome.storage.local.get(['userStatus', 'email'], async function (response, reject) {
                console.log(`here? ` + response.email);
                if (chrome.runtime.lastError) resolve('fail');
                if (response.userStatus === "undefined") resolve('fail');
                try {
                    const res = await fetch('http://localhost:3000/logout', {
                        method: 'GET',
                        headers: {
                            'type': 'register',
                            'Authorization': 'Basic ' + btoa(`${response.email}:F@#$`)
                        },
                    });
                    if (res.status !== 200)
                         resolve('fail');
                    chrome.storage.local.set({ userStatus: signIn, email: {} }, function (response_1) {
                        if (chrome.runtime.lastError)
                            resolve('fail');
                        user_signed_in = signIn;
                        resolve('success');
                    });
                } catch (err) {
                    console.log('hata');
                    console.log(err);
                }
            });
        })
    }
}

is_user_signed_in()
    .then(res => {
        console.log('works at begin?');
        if (res.userStatus) {
            user_signed_in = res.userStatus;
        }
    })
    .catch(err => console.log(err));



chrome.action.onClicked.addListener(
    function () {
        is_user_signed_in()
            .then(res => {
                if (res.userStatus) {
                    chrome.windows.create({
                        url: './popup-sign-out.html',
                        width: 300,
                        height: 600,
                        focused: true
                    });
                } else {
                    chrome.windows.create({
                        url: './popup-sign-in.html',
                        width: 300,
                        height: 600,
                        focused: true
                    });
                }
            })
            .catch(err => console.log(err));
    }
)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "login") {
        change_user_status(true, request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === "logout") {
        change_user_status(false, null)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === "register") {
        console.log(request.payload);
        register(request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    }
});



function register(userInfo) {
    var credsObj = {
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        pass: userInfo.pass
    }

    return new Promise(async resolve => {
        try {
            console.log(credsObj);
            const res = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${userInfo.email}:${userInfo.pass}`)
                }, body:  JSON.stringify(credsObj)
            });
            if (res.status === 400)
                resolve('bad_request');
            if (res.status === 409)
                resolve('duplicate_mail');
            if (res.status === 200) {
                chrome.storage.local.set({ userStatus: true, email: userInfo.email }, function (response) {
                    if (chrome.runtime.lastError)
                        resolve('fail');
                    user_signed_in = true;
                    resolve('success');
                });
            }
        } catch (err) {
            console.log(err);
        }
    });
}