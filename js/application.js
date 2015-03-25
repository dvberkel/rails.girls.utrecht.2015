/*global Reveal*/
(function(Reveal){
    Reveal.addEventListener('heart', function(event){
        console.log('visited page ', event.type);
    });
})(Reveal);
