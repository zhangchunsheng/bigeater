/*
 * 
 * @file     : Page.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var Page = function(setting) {
    this.setting = $.extend({
        id          : '',
        className   : '',
        comps       : []
    }, setting);
    this.id = this.setting.id;
    this.components = {};
    this._init();
};

$.extend(Page.prototype, {
    _addComp : function() {
        var me = this, json = arguments[0], i, len = json.length;
        for (i = 0; i < len; i++) {
            var comp = new Component(json[i]);
            me.components[comp.setting.id] = comp;
        };
        return me;
    },
       
    _init : function() {
        var me = this;
        me._addComp(me.setting.comps);
        return me;
    },
        
    render : function() {
        var me = this,
            setting = me.setting,
            coms = me.components;
        ROOT.className = setting.className;
        for (var i in coms) {
            coms[i].render();
        };
        return me;
    },
        
    dispose : function(){
        var that = this;
        ROOT.innerHTML = '';
    },
    /*
     * TODO 把component的事件移植到page上来，这样每个component能够互相操作
     */
    _on : function() {
        var me = this
    }, 
    
    _un : function() {
        
    }
});
