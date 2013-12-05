(function(window, $){
    var page = function(opt) {
        this.opt = opt || {};
        this.init();
    };
    
    $.extend(page.prototype, {
        
        _addBtn : function() {
            var that = this, json = arguments[0], i, len = json.length;
            for (i = 0; i < len; i++) {
                var button = new E.Button(json[i]);
                that.btns.push(button);
            };
            return that;
        },
        
        init : function() {
            var that = this, opt = that.opt;
            that.id = opt.id || '';
            that.className = opt.className || '';
            that.btns = [];
            that.init = opt.init || false;
            that._addBtn(opt.btns || '');
        },
        
        render : function() {
            var that = this, bs = that.btns, len = bs.length - 1;
            E._root.className = that.className;
            that.init && that.init();
            //显示Button
            for (; len >= 0; len--) {
                bs[len].render();
            };
            return that;
        },
        
        dispose : function(){
            var that = this;
            E._root.innerHTML = '';
        }
    });
    
    E.Page = page;
    
})(window, $);

