
/*加载用户保存的数据-进入pop页面时触发*/
chrome.storage.sync.get(['tip','userData'], result => {
    if(result.tip){

    }
    if(result.userData){
        let inputBaseUrl = document.getElementById('input_baseUrl');
        let inputTag = document.getElementById('input_tag');
        let inputInterval = document.getElementById('input_interval');
        inputBaseUrl.value = result.userData.userUrl;
        inputTag.value = result.userData.userTag;
        inputInterval.value = result.userData.userInterval;
        //每次加载页面时自动生成链接
        $('#get_url_btn').click();
    }
});

/* 【按钮】【获取历史回顾URL】生成并复制URL */
$('#get_url_btn').click(e => {
    var userData = getUserData();
    var bg = chrome.extension.getBackgroundPage();
    var endUrl = bg.getReviewUrl(userData);
    $('#input_result').val(endUrl);
    bg.copyToClipboard(endUrl);
    $('#span_copy_result').text("链接自动复制成功!");
});

/* 【按钮】【测试成功即可设置用户数据】保存设置数据 */
$('#set_user_data_btn').click(e => {
    var userData = getUserData();
    var bg = chrome.extension.getBackgroundPage();
    var defaultData = bg.getDefaultData();
    bg.setReminder(userData.userInterval, defaultData.defaultTip, userData);
    alert("用户设置已保存");
});

/* 【按钮】【获取已保存的数据】加载保存的设置数据 */
$('#get_store_data_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.showStoreData()
});

/*【按钮】【执行请求】执行请求按钮点击时间*/
$('#click_ajax_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.sendTest()
});

/*【按钮】【查看定时器】*/
$('#show_alarms_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.getAllAlarms()
});

function getUserData() {
    var bg = chrome.extension.getBackgroundPage();
    var defaultData = bg.getDefaultData();
    var userUrl = $('#input_baseUrl').val();
    if (userUrl == '') {
        userUrl = defaultData.defaultUserUrl;
    }
    var userTag = $('#input_tag').val();
    if (userTag == '') {
        userTag = defaultData.defaultTag;
    }
    var userInterval = $('#input_interval').val();
    if (userInterval == '') {
        userInterval = defaultData.defaultInterval;
    }else {
        userInterval = parseInt(userInterval);
    }

    var userData = {
        "userUrl": userUrl,
        "userTag": userTag,
        "userInterval": userInterval
    }
    return userData;
};
