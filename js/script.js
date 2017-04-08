$(function () {
    $menu = $('.menu');
    $('h2').each(function () {
        var $this = $(this);
        var $link = $('<a href="#' + $this.attr('id') + '">' + $this.text() + '</a>');
        $link.addClass($this.attr('class'));
        $menu.append($link);
    });
});

$(function () {
    $('.container').masonry({
        itemSelector: '.item',
        columnWidth: 310,
        isAnimated: false
    });
    $('.item').each(function () {
        var $item = $(this);
        var MAX_HEIGHT = 200;
        if ($item.height() <= MAX_HEIGHT + 33 || $item.hasClass('expand-disable')) {
            return;
        }
        var $bar = $('<a href="#" class="expand-toggle">Expand / Collapse</a>');
        $bar.click(function () {
            if ($item.hasClass('open')) {
                /* Close it */
                ga('send','event','expandtoggle','close',$item.id);
                $item.removeClass('open');
                $item.addClass('closed');
            } else {
                /* Open it */
                ga('send','event','expandtoggle','open',$item.id);
                $item.removeClass('closed');
                $item.addClass('open');
            }
            $('.container').masonry('reload');
            return false;
        });
        $item.addClass('closed');
        $item.addClass('has-toggle-bar');
        $item.append($bar);
    });
    $('.container').masonry('reload');
});
