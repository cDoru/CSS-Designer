function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

Array.prototype.has = function (testVal) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === testVal) return i+1;
    }
    return false;
}

Array.prototype.each = function (func) {
    for (var i = 0; i < this.length; i++) {
        func(this[i]);
    }
}

Array.prototype.delOne = function (delVal) {
    if (this.has(delVal)) {
        this.splice(this.has(delVal)-1, 1);
    }
}

Array.prototype.del = function (delVal) {
    if (typeOf(delVal) == 'array') {
        for (var i = 0; i < delVal.length; i++) {
            this.delOne(delVal[i]);
        }
    } else {
        this.delOne(delVal);
    }
    return this;
}

Array.prototype.multiply = function () {
    var i,j,k, tmp = this[0], tmptmp = [];
    for (i = 1; i < this.length; i++) {
        tmptmp = [];
        for (j = 0; j < this[i].length; j++) {
            for (k = 0; k < tmp.length; k++) {
                tmptmp[j * tmp.length + k] = tmp[k] + this[i][j];
            }
        }
        tmp = tmptmp;
    }
    return tmp;
}

Array.prototype.glue = function(array1, array2, array3) {
    this.concat([array1, array2, array3].multiply());
    return this;
}
