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

    var Step = function(){};
    Step.prototype.description = function(){
        return this.type + this.x + ',' + this.y;
    };

    var MoveTo = function(x, y){
        Step.call(this);
        this.type = 'M';
        this.x = x;
        this.y = y;
    };
    MoveTo.prototype = Object.create(Step.prototype);
    MoveTo.prototype.constructor = MoveTo;

    var LineTo = function(x, y){
        Step.call(this);
        this.type = 'L';
        this.x = x;
        this.y = y;
    };
    LineTo.prototype = Object.create(Step.prototype);
    LineTo.prototype.constructor = LineTo;

    var HalfCircleTo = function(x, y, r, direction) {
        Step.call(this);
        this.type = 'A';
        this.x = x;
        this.y = y;
        this.r = r;
        this.direction = direction;
    };
    HalfCircleTo.prototype = Object.create(Step.prototype);
    HalfCircleTo.prototype.constructor = HalfCircleTo;
    HalfCircleTo.prototype.description = function(){
        return [
            this.type,
            this.r + ',' + this.r,
            0,
            '0,' + (this.direction === -1 ? 1: 0),
            this.x + ',' + this.y
        ].join(' ');
    };

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
        var r = ab * 1/2 * sinAlpha;
        var points = [
            new MoveTo(this.x, this.y),
            new LineTo(this.x + this.direction * w, this.y - ab/2 - h),
            new HalfCircleTo(this.x, this.y - ab, r, this.direction),
        ];
        var n=10;
        var ds = ab/n;
        var dw = ds * 1/2 * Math.tan(alpha);
        for (var index = 0; index < n; index++) {
            points.push(new LineTo(this.x + dw, this.y - ab + (index + 1/2) * ds));
            points.push(new LineTo(this.x, this.y - ab + (index + 1) * ds));
        }

        return points;
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
            return point.description();
        }).join('');
    };



})(window.heart = window.heart || {});
