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
    bg.setReminder(userData.userInterval * 60, defaultData.defaultTip, userData);
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
    var userInterval = parseInt($('#input_interval').val());
    if (userInterval == '') {
        userInterval = defaultData.defaultInterval;
    }

    var userData = {
        "userUrl": userUrl,
        "userTag": userTag,
        "userInterval": userInterval
    }
    return userData;
};
