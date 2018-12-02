$(document).ready(function () {
  $('.delete-recipe').on('click', function () {
    let id = $(this).data('id');
    let url = "/delete/" + id;
    if (confirm("Delete Recipe?")) {
      $.ajax({
        url: url,
        type: "DELETE",
        success: function (result) {
          console.log('Deleting Recipe...');
          window.location.href = "/";
        },
        error: function (err) {
          console.log(err);
        }
      });
    }
  });

  $('.edit-recipe').on('click', function () {
    $('#edit-form-id').val($(this).data('id'));
    $('#edit-form-name').val($(this).data('name'));
    $('#edit-form-ingredients').val($(this).data('ingredients'));
    $('#edit-form-directions').val($(this).data('directions'));
  });
});