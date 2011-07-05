var maxLength = 20;

function onlyWhiteSpace(string) {
    var ord, i;
    for (i = 0; i < string.length; i++) {
        ord = string.charCodeAt(i);
        if ((ord!=9)&&(ord!=10)&&(ord!=32)) break;
    }
    return (i==string.length);
}

function getAttrList(node) {
    var attributes =    Array(Array('id', 'Id'), Array('target', 'Target'),
                        Array('href', 'Link'),   Array('name', 'Name'),   
                        Array('src', 'Source'),  Array('class', 'Class')),
        AttrString = "", i;
    for (i=0; i<attributes.length; i++) {
        if (node.attr(attributes[i][0])) {
            AttrString += ", " + attributes[i][1] + "='";
            AttrString += node.attr(attributes[i][0]) + "'";
        }
    }
    return AttrString;
}

function FormatText(string) {
    if (string.length > maxLength) {
        string = string.substr(0, maxLength) + '...(' + string.length + ' Z.)';
    }
    return string;
}

function createElementTree(node) {
    var ol = $('<ol>');
    node.data('mountPoint', ol);
    node.each(function(i){
        var me = $(this);
        switch (me.attr('nodeType')) {
            case 3:
                var text = me.attr('nodeValue');
                if (onlyWhiteSpace(text)) break;
                var li = $('<li>').html("Text: '" + FormatText(text) + "'");
                break;
            case 1:
                if (me.attr('tagName') == "SCRIPT") break;
                var li = $('<li>').html(me.attr('tagName') + getAttrList(me));
                if (me.children().length>0) {
                    var fChild = me.children(':first');
                    if ((me.children().length == 1) &&
                        (fChild.attr('nodeType') == 3) &&
                        (!onlyWhiteSpace(fChild.attr('nodeValue')))) {
                        $(li).append(", Text: '" + FormatText(fChild.attr('nodeValue')) + "'");
                    } else {
                        createElementTree(me.children()).appendTo(li);
                    }
                }
                break;
            default:
                /* var li = $('<li'>).append('Type:  ' + Child.nodeType);  /
                   li.append('<br/>' + 'Value: ' + Child.nodeValue);      */
                break;
        }
        if (!li) return;
        li.data('LinkElement', me);
        li.click(function(event){
            event.stopPropagation();
            var Link = $(this).data('LinkElement');
            document.ActEle = Link;
            Link.effect('highlight', {}, "normal");
        });
        li.appendTo(me.data('mountPoint'));
        me.removeData('mountPoint');
    });
    return ol;
}

function _initGrab() {
    var Grab   = $('<div id="BWL_Grab" >').css({'display': 'none'}),
        Header = $('<h2>Grab Window</h2>');
    Grab.draggable({'handle': Header, 'cursor': 'move'});
    EleContainer = $('<div>').append(createElementTree($('body')));
    Grab.append(Header.add(EleContainer)).appendTo('body').show('slow');
}
