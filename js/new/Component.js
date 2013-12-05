/*
 * 
 * @file     : Component.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */

var Component = function(setting){
    this.setting = $.extend({
        id          : '',
        className   : [],
        parent      : ROOT,
        events      : {},
        active      : false,
        type        : 'div',
        template    : '',
        attrs         : {}
    }, setting);
    
    this.dom = null;
    this._init();
};

$.extend(Component.prototype, {
    _init : function() {
        var me = this, attrs = me.setting.attrs;
        for( var i in attrs ) {
            if( typeof attrs[i] == 'function') {
                me[i] = function() {
                    attrs[i].apply(me, arguments);
                }
            } else {
                me[i] = attrs[i];
            }
        }
    },
	
    render : function(container) {
        var me = this, setting = me.setting, dom;
        if( setting.template != '' ) {
            var temp = document.createElement('div');
            temp.innerHTML = setting.template;
            dom = temp.firstChild;
        } else {
            dom = easyDom(setting.id, setting.className, setting.type);
        }
        !me.active && ( dom.style.display = 'none' );
        ROOT.appendChild(dom);
        me.dom = dom;
        //me.on();
		/*
        for( var i in setting.fns) {
            me[i] = function() {
                setting.fns.call(me);
            }
        }
        */
        return me;
    },
    /*
    on : function(){
        var me = this, setting = me.setting,
            events = setting.events;
        if( !me.dom || !events ) return;
        
        for( var i in events ) {
            $(me.dom).bind(i, function(){
                setting.active && events[i].call(me);
            });
        }
        return me;
    },
        
    un : function(){
        var me = this;
        me.dom && ($(me.dom).unbind());
    },
    */
    dispose : function(){
        var me = this;
        //me.un();
        me.dom.parentNode.removeChild(me);
    },
        //only to className, active
        //todo for all properties
    active : function() {
        var me = this;
        me.setting.active = true;
        me.dom.style.display = 'block';
    },
    
    unActive : function() {
        var me = this;
        me.setting.active = false;
        me.dom.style.display = 'none';
    }
});
