'use strict';

;( function ( document, window, index )
{
    var label	 = document.getElementById('fileinputlabel'),
        labelVal = label.innerHTML,
        fileinput = document.getElementById('file');
    
    fileinput.addEventListener( 'change', function( e )
    {
        var fileName = '';
        if( this.files ) {
            fileName = e.target.value.split( '\\' ).pop();
        }
        if( fileName ) {
            label.querySelector( 'span' ).innerHTML = fileName;
        } else {
            label.innerHTML = labelVal;
        }
    });

    // Firefox bug fix
    fileinput.addEventListener( 'focus', function(){ fileinput.classList.add( 'has-focus' ); });
    fileinput.addEventListener( 'blur', function(){ fileinput.classList.remove( 'has-focus' ); });
}( document, window, 0 ));