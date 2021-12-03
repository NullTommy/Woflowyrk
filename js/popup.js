$('#get_url_btn').click(e => {
    var userData = getUserData();
    // alert(JSON.stringify(userData))
    var bg = chrome.extension.getBackgroundPage();
    var endUrl = bg.getReviewUrl(userData);
    $('#input_result').val(endUrl);
    bg.copyToClipboard(endUrl);
    $('#span_copy_result').text("链接自动复制成功!");
});

$('#set_user_data_btn').click(e => {
    var userData = getUserData();
    var bg = chrome.extension.getBackgroundPage();
    var defaultData = bg.getDefaultData();
    bg.setReminder(userData.userInterval, defaultData.defaultTip, userData);
});

$('#get_store_data_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.getStoreData()
});

$('#click_ajax_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.sendTest()
});

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
