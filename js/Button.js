(function(window, $){
    var button = function(){
        var opt = arguments[0] || {};
        this.id = opt.id || '';
        this.className = opt.className || '',
        this.dom = null;
        this.onclick = opt.onclick || function(){};
        this.active = opt.active || false;
        this.type = opt.type || 'div';
        return this;
    };
    $.extend(button.prototype, {
        
        render : function(container) {
            var that = this, 
                con = container || E._root,
                dom = document.createElement(that.type);
            dom.id = that.id;
            that.active && ( dom.className = that.className );
            con.appendChild(dom);
            
            that.dom = dom;
            that.on();
            return that;
        },
        
        on : function(){
            var that = this;
            if( that.dom ) {
                $(that.dom).bind('touchstart click', function(event){
                    event.preventDefault();
                    that.active && that.onclick();
                    event.stopPropagation();
                });
            }
            return that;
        },
        
        un : function(){
            var that = this;
            that.dom && ($(that.dom).unbind());
        },
        
        dispose : function(){
            
        },
        //only to className, active
        //todo for all properties
        active : function() {
            var that = this;
            that.dom.className = that.className;
            that.active = true;
        },
        
        unActive : function() {
            var that = this;
            that.dom.className = '';
            that.active = false;
        }
    });
    
    E.Button = button;

})(window, $);
