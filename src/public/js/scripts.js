$('#post-a-comment').hide();
$('#btn-toggle-comment').on('click', function(e) {
    e.preventDefault();
    $('#post-a-comment').slideToggle();
})
$('#btn-like').on('click', function(e) {
    e.preventDefault();
    let img_id = $(this).data('id');
    $.post('/images/' + img_id + '/like')
        .done(data => {
            $('.likes-count').text(data.likes)
        })
})
$('#btn-delete').on('click', function(e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure you want to delete this image?')
    if (response) {
        let img_id = $this.data('id')
        $.ajax({
                url: '/images/' + img_id,
                method: 'DELETE'
            })
            .done(function(result) {
                $this.removeClass('btn-danger').addClass('btn-success')
                $this.find('i').removeClass('fa-times').addClass('fa-check')
                $this.append('<span>Deleted!</span>')

            })
    }
})