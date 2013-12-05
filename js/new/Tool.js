/*
 * 
 * @file     : Tool.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */

/*
 * create a simple Dom, with id classnames and type
 * @return HTMLDOMElement
 */
function easyDom( id, className, type) {
    if( typeof id != 'string' ) {
        type = className;
        className = id;
        id = null;
    }
    if( typeof className != 'object' ) {
        type = className;
        className = [];
    }
    var dom = document.createElement(type || 'div'), names = '';
    id && ( dom.id = id );
    for( var i = 0, len = className.length; i < len; i++ ) {
        names += className[i] + ' ';
    }
    names != '' && ( dom.className = names.slice(0, -1));
    
    return dom;
}