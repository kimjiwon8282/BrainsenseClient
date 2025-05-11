document.addEventListener('DOMContentLoaded', () => {
  const productSW = document.querySelectorAll('.sw_product_card');
  const productHW = document.querySelectorAll('.hw_product_card');

  productSW.forEach((card) => {
    card.addEventListener('click', () => {
      const productName = card.getAttribute('data-product');

      if (productName === 'SafeNest') {
        window.location.href = '/products/sw/safenest';
      } else if (productName === 'CATCHME') {
        window.location.href = '/products/sw/catchme';
      } else if (productName === 'JEJE') {
        window.location.href = '/products/sw/jeje';
      }
    });
  });

  productHW.forEach((card) => {
    card.addEventListener('click', () => {
      const productName = card.getAttribute('data-product');
      if (productName === 'Sensor') {
        window.location.href = '/products/hw/sensor';
      }
    });
  });
});
