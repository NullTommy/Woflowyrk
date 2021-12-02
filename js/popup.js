$('#get_url_btn').click(e => {
    var userData = getUserData();
    alert(JSON.stringify(userData))
    var bg = chrome.extension.getBackgroundPage();
    var endUrl = bg.getReviewUrl(userData);
    $('#input_result').val(endUrl);
    bg.copyToClipboard(endUrl);
    $('#span_copy_result').text("链接自动复制成功!");
});

$('#set_user_data_btn').click(e => {
    var userData = getUserData();
    var bg = chrome.extension.getBackgroundPage();
    bg.setReminder(userData.userInterval * 60, "回顾一下WorkFlowy吧!链接已自动复制到剪贴板！", userData);
});

function getUserData() {
    var userUrl = $('#input_baseUrl').val();
    if (userUrl == '') {
        userUrl = "https://workflowy.com/#?q=";
    }
    var userTag = $('#input_tag').val();
    if (userTag == '') {
        userTag = "@文档标题";
    }
    var userInterval = $('#input_interval').val();
    if (userInterval == '') {
        userInterval = 1;
    }

    var userData = {
        "userUrl": userUrl,
        "userTag": userTag,
        "userInterval": userInterval
    }
    return userData;
};
