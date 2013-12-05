/*
 * 
 * @file     : Load.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var LoadBar = function(setting, imgsSrc) {
    this.setting = $.extend({
        id              : 'LoadBar',
        className       : 'load-bar',
        parent          : 'eater',
        core            : '<div id="LoadCore" class="load-core"><div class="load-process"></div></div>',
        onBeforeStart   : null,
        onAfterEnd      : null,
        onProcess       : null
    }, setting);
    this.imgsSrc = imgsSrc || [];
    this._init();
};
    
$.extend(LoadBar.prototype, {
    _init : function(){
        var me = this, setting = me.setting;
        me._el = $('<div id="' + setting.id + '" class="' + setting.className + '"></div>');
        me._core = $(setting.core);
        me._el.append(me._core);
        return me;
    },
        
    start : function() {
        var me = this, 
            srcs = me.imgsSrc,
            set = me.setting,
            i = 0, len = srcs.length, process = 1;
        $('#' + set.parent).append(me._el);
        set.onBeforeStart && set.onBeforeStart.call(me);
        
        for (; i < len; i++) {
            var img = new Image();
            img.onload = function() {
                set.onProcess.call(me, process / len );
                process++ == len && set.onAfterEnd && set.onAfterEnd.call(me);
            };
            img.src = srcs[i];
        };
        return me;
    }
});


