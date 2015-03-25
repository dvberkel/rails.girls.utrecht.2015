/*global window*/
(function($){
    'use strict';

    var Observable = function(){
        this.observers = {};
    };
    Observable.prototype.on = function(event, observer){
        (this.observers[event] = this.observers[event] || []).push(observer);
    };
    Observable.prototype.emit = function(event){
        var args = Array.prototype.slice.call(arguments, 1);
        (this.observers[event] || []).forEach(function(observer){
            observer.apply(this, args);
        }.bind(this));
    };

    var Model = $.Model = function(alpha){
        Observable.call(this);
        this._alpha = alpha || 30;
    };
    Model.prototype = Object.create(Observable.prototype);
    Model.prototype.constructor = Model;
    Model.prototype.alpha = function(alpha){
        this.alpha = alpha || this.alpha;
        if (alpha !== undefined) {
            this.emit('alpha', this.alpha);
        }
    };
})(window.heart = window.heart || {});
