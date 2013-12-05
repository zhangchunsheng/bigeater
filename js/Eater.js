(function(window, $){
    var E = window.E || {};
    window.E = E;
    E._root = document.getElementById('eater');
    E._width = document.body.clientWidth;
    E._height = document.body.clientHeight;
    E._imgsResource = [
        'css/images/bg.png',
        'css/images/choose.jpg',
        'css/images/avatar-bg.png',
        'css/images/roombg.png',
        'css/images/main.png',
        'css/images/desk.png',
        'css/images/EMOTION_1.png',
        'css/images/EMOTION_2.png',
        'css/images/R.png',
        'css/images/H.png',
        'css/images/left.png',
        'css/images/right.png',
        'css/images/blood_bed.png',
        'css/images/yellow_blood.png',
        'css/images/green_blood.png',
        'css/images/g.png'
    ];
    
    E._imgs = [];
    
    E._getPositionInEvent = function(event){
        event.preventDefault();
        var pos = {};
        if (event.touches) {
            pos.x = event.touches[0].clientX - G._root.offsetLeft;
            pos.y = event.touches[0].clientY - G._root.offsetTop;
        } else {
            pos.x = event.clientX - G._root.offsetLeft;
            pos.y = event.clientY - G._root.offsetTop;
        }
        return pos;
    }

})(window, $);
