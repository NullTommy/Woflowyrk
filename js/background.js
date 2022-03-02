// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let alarmSet = new Set();

function setReminder(interval, tip, userData) {
    // interval 单位分钟
    // tip 提示的消息
    var st = new Date().getTime() + 60 * 1000 * interval;
    chrome.alarms.clearAll();
    chrome.alarms.create("WFReviewReminder", {when: st, periodInMinutes:interval});
    chrome.alarms.onAlarm.addListener(alarm => {
        if(alarm.name != "WFReviewReminder"){
            return
        }
        if(alarmSet.has(alarm.scheduledTime)){
            return
        }


        chrome.storage.sync.get(['tip','userData'], result => {
            if(result.tip){
                chrome.notifications.create(
                    {type:"basic",
                        iconUrl:"icon.png",
                        title:"WorkFowy Review",
                        message:result.tip,
                        requireInteraction:true}
                );
            }
            if(result.userData){
                var endUrl = getReviewUrl(result.userData);
                copyToClipboard(endUrl);
            }
        });

        alarmSet.clear();
        alarmSet.add(alarm.scheduledTime);
        console.log("*******Got an alarm!*********", alarm);
    });

    chrome.storage.sync.set({"interval": interval, "tip": tip,"userData": userData});
};

/* 将内容复制到剪贴板 */
function copyToClipboard(copyText) {
    /* 2、复制到剪贴板 */
    // 创建input元素，给input传值，将input放入html里，选择input
    var w = document.createElement('input');
    w.value = copyText;
    document.body.appendChild(w);
    w.select();
    // 调用浏览器的复制命令
    document.execCommand("Copy");
    // 将input元素隐藏，通知操作完成！
    w.style.display='none';
};


/* 获取WF回顾的URL*/
function getReviewUrl(userData) {
    /* 1、生成跳转链接 */
    var defaultData = getDefaultData();
    var base = '' != userData.userUrl ? userData.userUrl + "?q=" : defaultData.defaultQueryUrl;
    var since = "last-changed-since:";
    var before = "last-changed-before:";
    var tag = '' != userData.userTag ? userData.userTag : defaultData.defaultTag;
    var blank = "%20";

    var nowTime = new Date().getTime();
    var sourceDate = new Date("2021/05/01");//标签开始时间
    var sourceDateTime = sourceDate.getTime();
    var dayDiff = Math.round((nowTime - sourceDateTime) / (24 * 3600 * 1000));
    var ran = Math.ceil(Math.random() * dayDiff);//生成0-dayDiff之间的数字

    var sinceDate = new Date();
    var beforeDate = new Date();
    sinceDate.setTime(nowTime-ran * 1000 * 60 * 60 * 24)
    beforeDate.setTime(nowTime-(ran-1) * 1000 * 60 * 60 * 24)
    var sinceDateStr = sinceDate.format("MM/dd/yyyy");
    var beforeDateStr = beforeDate.format("MM/dd/yyyy");
    var endUrl =  base + since + sinceDateStr + blank + before + beforeDateStr + blank  + tag;
    return endUrl;
};

/* 获取保存的定时器数据*/
function getAllAlarms() {
    chrome.alarms.getAll(function(alarms) {
        let alarmTmpList = new Array();
        for (let i in alarms){
            var alarm = alarms[i];
            var alarmTmp = {};
            alarmTmp.name=alarm.name;
            alarmTmp.periodInMinutes=alarm.periodInMinutes;
            alarmTmp.scheduledTime=alarm.scheduledTime;
            var scheduledDate = new Date(alarm.scheduledTime);
            var scheduledTimeStr = scheduledDate.format("MM/dd/yyyy hh:mm:ss");
            alarmTmp.scheduledTimeStr=scheduledTimeStr;
            alarmTmpList.push(alarmTmp);
        }
        alert(JSON.stringify(alarmTmpList));
    })
};

/* 获取保存的数据*/
function showStoreData() {
    chrome.storage.sync.get(['tip','userData'], result => {
        var dataStr = "数据:";
        if(result.tip){
            dataStr = dataStr + result.tip;
        }
        dataStr += "\n";
        if(result.userData){
            dataStr += JSON.stringify(result.userData);
        }
        alert(dataStr);
    });
};

/* 触发手机*/
function sendTest() {
    $.ajax({
        url: "https://api.day.app/test", async: true, success: function (result) {
            alert("ajax Success")
        }
    });
};

/* 获取默认数据*/
function getDefaultData() {
    var defaultData= {
        "defaultUserUrl": "https://workflowy.com/#",
        "defaultQueryUrl": "https://workflowy.com/#?q=",
        "defaultTag": "@文档标题",
        "defaultInterval": 60,
        "defaultTip": "回顾一下WorkFlowy吧!链接已自动复制到剪贴板！"
    }
    return defaultData;
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

// 一加载插件，就默认设置提醒
chrome.runtime.onInstalled.addListener(function(reason){
    var defaultData = getDefaultData();
    var userData = {
        "userUrl": defaultData.defaultUserUrl,
        "userTag": defaultData.defaultTag,
        "userInterval": defaultData.defaultInterval
    }
    setReminder(userData.userInterval, defaultData.defaultTip, userData);
    alert("插件安装或更新成功！提醒初始化成功");
});

// 每次电脑重启或者谷歌浏览器重启自动加载用户数据
chrome.runtime.onStartup.addListener(function(reason){
    var defaultData = getDefaultData();
    var userData = {
        "userUrl": defaultData.defaultUserUrl,
        "userTag": defaultData.defaultTag,
        "userInterval": defaultData.defaultInterval
    }
    chrome.storage.sync.get(['tip','userData'], result => {
        if(result.userData){
            userData.userUrl = result.userData.userUrl;
            userData.userTag = result.userData.userTag;
            userData.userInterval = result.userData.userInterval;
        }
    });
    setReminder(userData.userInterval, defaultData.defaultTip, userData);
    // alert("浏览器启动成功！提醒设置成功");
});
