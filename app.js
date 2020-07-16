/**
 * Debugger
 */

function l(a, b='') {
    console.log(a, '<-->', JSON.stringify(b));
}

/** 
 * Hamburger menu 
*/

$('.hamburgerMenu').on('mouseover', function () {
	$('.menu').css('display', 'block');
	
});

$('main').on('mouseover', function() {
    $('.menu').css('display', 'none');
})

/**
 * App
 */