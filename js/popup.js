$('#get_url_btn').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    var endUrl = bg.getReviewUrl();
    $('#input_result').val(endUrl);
    bg.copyToClipboard(endUrl);
    $('#span_copy_result').text("链接自动复制成功!");
});
