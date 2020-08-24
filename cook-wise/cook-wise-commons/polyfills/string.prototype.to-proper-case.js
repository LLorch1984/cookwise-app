if (typeof String.prototype.toProperCase === 'undefined') {
    String.prototype.toProperCase = function() {
        return this[0].toUpperCase() + this.substring(1);
    }
} 