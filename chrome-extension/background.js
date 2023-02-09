let user_signed_in = false;

function is_user_signed_in() {
    return new Promise(resolve => {
        chrome.storage.local.get(['userStatus', 'userInfo'], function (response) {
            if (chrome.runtime.lastError) resolve({ userStatus: false, userInfo: {} });
            resolve(
                response.userStatus === undefined ?
                    { userStatus: false, userInfo: {} } :
                    { userStatus: response.userStatus, userInfo: response.userInfo }
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
                'Authorization': 'Basic ' + btoa(`${userInfo.email}:${userInfo.pass}`)
            },
        }).then(res => {
            return new Promise(resolve => {
                if (res.status !== 200) resolve('fail');
                chrome.storage.local.set({ userStatus: signIn, userInfo }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                    user_signed_in = signIn;
                    resolve('success');
                });
            });
        }).catch(err => console.log(err));
    } else if (!signIn) {
        return new Promise(resolve => {
            chrome.storage.local.get(['userStatus', 'userInfo'], function (response) {
                console.log(response);
                if (chrome.runtime.lastError) resolve('fail');
                if (response.userStatus === "undefined") reject('fail');
                return fetch('http://localhost:3000/logout', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${response.userInfo.email}:${response.userInfo.pass}`)
                    },
                }).then(res => {
                    if (res.status !== 200) resolve('fail');
                    chrome.storage.local.set({ userStatus: signIn, userInfo: {} }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');
                        user_signed_in = signIn;
                        resolve('success');
                    });
                }).catch(err => {
                    console.log('burasiii');
                    console.log(err)
                });
            });
        })
    }
}

is_user_signed_in()
    .then(res=>{
        console.log('works at begin?');
        if (res.userStatus) {
            user_signed_in=res.userStatus;
        }
    })
    .catch(err=>console.log(err));



chrome.action.onClicked.addListener(
    function () {
            is_user_signed_in()
                .then(res=>{
                    if (res.userStatus) {
                            chrome.windows.create({
                                url: './popup-sign-out.html',
                                width: 300,
                                height: 600,
                                focused: true
                            });
                    }else{
                        chrome.windows.create({
                            url: './popup-sign-in.html',
                            width: 300,
                            height: 600,
                            focused: true
                        });
                    }
                })
                .catch(err=>console.log(err));
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
    } else if (request.message === "userStatus") {

    }
});