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
        this._alpha = alpha || this._alpha;
        if (alpha !== undefined) {
            this.emit('alpha', this._alpha);
        }
        return this._alpha;
    };

    var MoveTo = function(x, y){
        this.type = 'M';
        this.x = x;
        this.y = y;
    };

    var LineTo = function(x, y){
        this.type = 'L';
        this.x = x;
        this.y = y;
    }

    var ControlPoints = $.ControlPoints = function(model, direction, x, y){
        Observable.call(this);
        this.model = model;
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.model.on('alpha', this.signal.bind(this));
    };
    ControlPoints.prototype = Object.create(Observable.prototype);
    ControlPoints.prototype.constructor = ControlPoints;
    ControlPoints.prototype.signal = function(){
        this.emit('controlpoints', this.controlPoints());
    };
    ControlPoints.prototype.controlPoints = function(){
        var alpha = this.model.alpha() * Math.PI / 180;
        var sinAlpha = Math.sin(alpha);
        var coefficient = 1/2 * sinAlpha * (1 - sinAlpha);
        var ab = this.y/(1 + coefficient);
        var w = ab * 1/2 * Math.sin(2 * alpha);
        var h = ab * 1/2 * Math.cos(2 * alpha);
        return [
            new MoveTo(this.x, this.y),
            new LineTo(this.x + this.direction * w, this.y - ab/2 - h),
            new LineTo(this.x, this.y - ab)
        ];
    };

    var View = $.View = function(model, path){
        this.model = model;
        this.path = path;
        this.update();
    };
    View.prototype.update = function(){
        this.path.setAttribute('d', this.description());
    };
    View.prototype.description = function(){
        return this.model.controlPoints().map(function(point){
            return point.type + point.x + ',' + point.y;
        }).join('');
    };



})(window.heart = window.heart || {});
