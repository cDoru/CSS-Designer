$(function(){
    var i = '<input>',
        b = 'button',
        className = 'spinbutton',
        ARROW_WID = 25, // in pixel
        _up   = $(i).attr({value:'▲', type:b}),
        _down = $(i).attr({value:'▼', type:b}),

    sepUnit = function (value) {
        var i = 0, number = '', unit = '';
        while ((i < value.length) && ('-+1234567890'.indexOf(value[i])!=-1))
        number += value[i++];
        while (i < value.length)
        unit += value[i++];
        number = parseInt(number);
        return [parseInt(number), unit];
    },

    f = function (Element, dir) {
        var val = sepUnit(Element.val());
        if (isNaN(val[0])) return;
        Element.val((val[0] + dir) + val[1]);
        Element.trigger('change');
    },
    f_up   = function (Element) {f(Element, +1);},
    f_down = function (Element) {f(Element, -1);},

    addSpinbuttons = function() {
        var me = $(this),
            up   =  _up.clone(),
            down =  _down.clone(),
            arr  =  $('<span>').append(up.add(down)),
            mid  = me.attr('id'),
            w    = 'width',
            wid  = sepUnit(me.css(w)),
            kd   = 'keydown',
            cont = me.wrap('<div>').parent();
        up.click(function(){f_up(me)});
        up.mousedown(function(){me.data(kd, window.setInterval(function() {f_up(me)},200));});
        up.mouseup(function(){window.clearInterval(me.data(kd));});
        up.mouseout(function(){down.trigger('mouseup')});
        down.click(function(){f_down(me)});
        down.mousedown(function(){me.data(kd, window.setInterval(function() {f_down(me)},200));});
        down.mouseup(function(){window.clearInterval(me.data(kd));});
        down.mouseout(function(){down.trigger('mouseup')});
        me.after(arr);
        cont.addClass(className);
        me.removeClass(className);
        if (mid) {
            cont.attr('id', mid);
            me.removeAttr('id');
        }        
        cont.css(w, wid[0] + wid[1]);
        me.css(w,(wid[0]-ARROW_WID) + wid[1]);
        up.add(down).css(w, ARROW_WID + wid[1]);
    };

    $('input.' + className).each(addSpinbuttons);
    $.include('JS Stuff/spinbutton.min.css');
});
