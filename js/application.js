/*global Reveal, document, heart, console*/
(function(Reveal, heart){
    'use strict';

    Reveal.addEventListener('heart', function(event){
        var model = new heart.Model(20, 320, 480);

        var leftControlPoints = new heart.ControlPoints(model, -1, 320, 480);
        var leftHeart = document.getElementById('left-heart');

        new heart.View(leftControlPoints, leftHeart);

        var rightControlPoints = new heart.ControlPoints(model, +1, 320, 480);
        var rightHeart = document.getElementById('right-heart');

        new heart.View(rightControlPoints, rightHeart);
    });
})(Reveal, heart);
