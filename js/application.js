/*global document, Reveal, Velocity, heart, console*/
(function(Reveal, Velocity, heart){
    'use strict';

    Reveal.addEventListener('heart', function(event){
        var model = new heart.Model(40, 320, 480);

        var leftControlPoints = new heart.ControlPoints(model, -1, 320, 480);
        var leftHeart = document.getElementById('left-heart');

        new heart.View(leftControlPoints, leftHeart);

        var rightControlPoints = new heart.ControlPoints(model, +1, 320, 480);
        var rightHeart = document.getElementById('right-heart');

        new heart.View(rightControlPoints, rightHeart);

        var state = 0;
        document.body.addEventListener('keydown', function(event){
            if (event.keyCode === 65) {
                if (state == 0) {
                    Velocity(rightHeart, {translateX: 480}, 2000);
                }
                if (state == 1) {
                    Velocity(rightHeart, {translateX: 0}, 2000);
                }
                state++;
            }
        });
    });
})(Reveal, Velocity, heart);
