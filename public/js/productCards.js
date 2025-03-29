document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.sw_product_card');

  productCards.forEach((card) => {
    card.addEventListener('click', () => {
      const productName = card.getAttribute('data-product');

      if (productName === 'SafeNest') {
        window.location.href = '/products/sw/safenest';
      } else if (productName === 'CATCHME') {
        window.location.href = '/products/sw/catchme';
      } else if (productName === 'JEJE') {
        window.location.href = '/products/sw/jeje';
      }
      if (productName === 'Sensor') {
        window.location.href = '/products/hw/sensor';
      }
    });
  });
});
