/*global window, document, navigator, Reveal, Velocity, heart*/
(function(Reveal, Velocity, heart){
    'use strict';

    var videoPromise = new Promise(function(accept, reject){
        navigator.webkitGetUserMedia({ 'video': {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            }
        }}, accept, reject);
    });

    Reveal.addEventListener('heart', function(){
        function paintHearts(color){
            [leftHeart, rightHeart].forEach(function(heart){
                heart.setAttribute('fill', color);
                heart.setAttribute('stroke', color);
            });
        }
        var model = new heart.Model(40, 320, 480);

        var leftControlPoints = new heart.ControlPoints(model, -1, 320, 480);
        var leftHeart = document.getElementById('left-heart');

        new heart.View(leftControlPoints, leftHeart);

        var rightControlPoints = new heart.ControlPoints(model, +1, 320, 480);
        var rightHeart = document.getElementById('right-heart');

        new heart.View(rightControlPoints, rightHeart);

        paintHearts('red');

        var state = 0;
        function handler(event){
            if (event.keyCode === 65) {
                if (state === 0) {
                    Velocity(rightHeart, {translateX: 480}, 2000);
                }
                if (state === 1) {
                    paintHearts('url(#rainbow)');
                }
                if (state === 2) {
                    Velocity(rightHeart, {translateX: 0}, 2000);
                    document.body.removeEventListener('keydown', handler);
                }
                state++;
            }
        }
        document.body.addEventListener('keydown', handler);
    });

    Reveal.addEventListener('webcam', function(){
        videoPromise.then(function(localMediaStream){
            var video = document.getElementById('webcam');
            video.src = window.URL.createObjectURL(localMediaStream);
            console.log(video);
        });
    });
})(Reveal, Velocity, heart);
