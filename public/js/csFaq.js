$(document).ready(function () {
  $('.faq-question').click(function () {
    var $faqItem = $(this).parent();

    if ($faqItem.hasClass('active')) {
      $faqItem.removeClass('active').find('.faq-answer').slideUp(300);
    } else {
      $('.faq-item').removeClass('active').find('.faq-answer').slideUp(300);
      $faqItem.addClass('active').find('.faq-answer').slideDown(300);
    }
  });
});
