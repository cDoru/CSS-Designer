function _initEdit() {
    document.ActEle = null;
    var Edit   = $('<div id="BWL_Edit" >'), //.css({'display': 'none'}),
        Header = $('<h2>Edit Window</h2>'),
        Form   = $('<form>');
    Edit.draggable({'handle': Header, 'cursor': 'move'});
    Edit.append(Header.add(Form));

    function unitConvert(value, from, to) {
        var f = [1, 1],
            unit = [from, to];
        for (var i=0;i<2;i++) {
            switch (unit[i]) {
                case '%' :  if (i) return 100; else return value/100; break;
                case 'pc':  f[i] *= 12;     // 12pt = 1pc
                case 'pt':  f[i] /= 72;     // 72pt = 1in
                case 'in':  f[i] *= 2.54;   // 2.54in = 1cm
                case 'cm':  f[i] *= 10;     // 10mm = 1cm
                case 'mm':  f[i] *= 1; break; // the default unit
                case 'ex':                  // I have no information about the difference to em
                case 'em':  f[i] *= 16;     // default font size 1em is 16px (just rule of thumb)
                case 'px':  f[i] /= 86;     // 86dpi is (96 M$-dpi + 72 *nix-dpi) / 2
                            f[i] *= 2.54;   // typographic unit in inch to mm
            }
        }
        return value*f[0]/f[1];
    }

    function dropDown(inhalt) {
        var Element = $('<select>');
        for (var i=0; i < inhalt.length; i++) {
            Element.append($('<option>').text(inhalt[i]));
        }
        return Element
    }

    function X(units, modes) {
        var Element = $('<span>'),
            input   = $('<input>').attr('class', 'spinbutton').val(0);
        input.change(function() {
            if (input.val() != 0) {
                Element.val(input.val() + unit.val());
            } else {
                Element.val('0');
            }
        });
        input.disable = function() {this.add(this.next().children()).attr('disabled', 'disabled');}
        input.enable  = function() {this.add(this.next().children()).removeAttr('disabled');}

        Element.append(input);
        var unit  = $('<select>'),
            addOp = function (ele) {unit.append($('<option>').text(ele));};
        unit.oldVal = 'px';
        units.each(addOp);
        modes.each(addOp);
        unit.change(function(event) {
            if (modes.has(unit.val())) {
                input.disable();
                input.val(0);
                Element.val(unit.val());
            } else {
                input.enable();
                input.val(unitConvert(input.val(), unit.oldVal, unit.val()));
                unit.oldVal = unit.val();
                Element.val(input.val() + unit.val());
                event.stopPropagation();
            }
        });
        Element.append(unit);
        return Element;
    }

    function inPut(inhalt) {
        var Element = $('<input>');
        Element.attr('type', 'text').val(inhalt);
        return Element;
    }

    function SetInput(name, edit) {
        var box=$('<span>');
        box.append(name + ': ');
        box.append(edit);
        edit.change(function() {
            var Ele = document.ActEle;
            value = $(this).val()
            if (!Ele) {
                alert('No element selected (Set '+name+' to '+value+')');
            } else {
                Ele.css(name, value);
            }
        });
        Form.append(box);
        Form.append($('<br/>'));
    }

    function generateFormElement(data) {
        switch (typeOf(data)) {
            case "array":   return dropDown(data);
            case "object":  switch(data["type"]) {
                case "Number":  return Ele = X(data["Units"], data["Mods"]);
                /* 1: mehrere Eigenschaften */
                /* 2: URL mit Mods */
                /* 2b: COLOR mit Mods */
                /* 3: mehrere Werte */
            }
            case "string":  
            default:        switch(data) {
                case "X":       return Ele = X(VarVar.unit,[]);
                case "COLOR":   // hier kommt mal ein fance Farbwähler rein
                case "input":
                default:        return inPut(data);
            }
        }
    }

    function addOptions(data) {
        alert('receiving data...');
        var myOpt, attr;
        for (attr in data) {
            SetInput(attr, generateFormElement(data[attr]));
        }
        $.include('JS Stuff/spinbutton.min.js');
        //$.include('JS Stuff/archiv/spinbutton/spinbutton.js');
    }

    $.ajaxSetup({'async': false,
	'beforeSend': function(xhr){
      	 	if (xhr.overrideMimeType)
            	xhr.overrideMimeType("text/plain");
        },
    });

    folder = 'JS Stuff/';
    help_file = 'CSS_helper.json';  $.getJSON(folder + help_file, function(data) {JSON=data});	/* Keine Ausführung ersichtlich! */
    css_file  = 'CSS_Attribs.json'; $.getJSON(folder + css_file,  addOptions);			/* Keine Ausführung ersichtlich! */

    Edit.appendTo('body'); //.show('slow');
}
