// Script for slider scroll (first version)
function slideLeft(button) {
    const slider = button.closest('.slider-container').querySelector('.slider-images');
    slider.scrollBy({ left: -200, behavior: 'smooth' });
}

function slideRight(button) {
    const slider = button.closest('.slider-container').querySelector('.slider-images');
    slider.scrollBy({ left: 200, behavior: 'smooth' });
}

// PERULANGAN SLIDE (second version, with transform)
function slideLeft(button) {
    const slider = button.closest('.slider-container').querySelector('.slider-images');
    const slides = slider.querySelectorAll('img');
    const currentIndex = getCurrentIndex(slider);
    const newIndex = (currentIndex - 1 + slides.length) % slides.length; // kembali ke akhir jika di awal
    slider.style.transform = `translateX(-${newIndex * 100}%)`;
}

function slideRight(button) {
    const slider = button.closest('.slider-container').querySelector('.slider-images');
    const slides = slider.querySelectorAll('img');
    const currentIndex = getCurrentIndex(slider);
    const newIndex = (currentIndex + 1) % slides.length; // kembali ke awal jika di akhir
    slider.style.transform = `translateX(-${newIndex * 100}%)`;
}

function getCurrentIndex(slider) {
    const style = window.getComputedStyle(slider);
    const matrix = new WebKitCSSMatrix(style.transform);
    const sliderWidth = slider.clientWidth;
    const slideIndex = Math.round(Math.abs(matrix.m41) / sliderWidth);
    return slideIndex;
}

// Lightbox functionality
let currentLightboxIndex = 0;
let lightboxImages = [];

// Buka lightbox saat gambar diklik
function openLightbox(imgElement) {
    const slider = imgElement.closest('.slider-images');
    lightboxImages = Array.from(slider.querySelectorAll('img')).map(img => img.src);
    currentLightboxIndex = lightboxImages.indexOf(imgElement.src);
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex];
    document.getElementById('lightbox').classList.remove('hidden');
}

// Tutup lightbox
function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

// Geser ke kiri
function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex];
}

// Geser ke kanan
function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex];
}

// --- GLOBAL CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function formatRupiah(num) {
    return 'Rp' + num.toLocaleString('id-ID');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        renderCartSidebar();
        cartSidebar.classList.remove('hidden');
        setTimeout(() => {
            cartSidebar.classList.add('show');
        }, 10);
    }
}

function hideCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('show');
        setTimeout(() => {
            cartSidebar.classList.add('hidden');
        }, 300);
    }
}

function renderCartSidebar() {
    const cartSidebarContent = document.getElementById('cartSidebarContent');
    if (!cartSidebarContent) return;
    
    if (cart.length === 0) {
        cartSidebarContent.innerHTML = '<p class="text-center p-4">Keranjang kosong.</p>';
        // Update cart count
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = '0';
        return;
    }

    let total = 0;
    let html = '<div class="p-4">';
    
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
            <div class="mb-4 p-2 border-b">
                <h3 class="font-semibold">${item.title}</h3>
                <p>Size: ${item.size}</p>
                <p>Quantity: ${item.qty}</p>
                <p>Price: ${formatRupiah(item.price * item.qty)}</p>
                <button onclick="removeFromCart(${index})" class="text-red-500 mt-2">Remove</button>
            </div>
        `;
    });

    html += `
        <div class="mt-4 pt-4 border-t">
            <h3 class="font-semibold">Total: ${formatRupiah(total)}</h3>
            <button id="buyAllBtn" class="btn-buy" style="margin-top:16px;background:linear-gradient(90deg, #ffdd00 60%, #ffe066 100%);padding:12px 0;font-size:1rem;letter-spacing:0.5px;color:#111;">Beli Sekarang</button>
        </div>
    </div>`;

    cartSidebarContent.innerHTML = html;
    
    // Update cart count
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
    
    // Add click handler for buy button
    const buyAllBtn = document.getElementById('buyAllBtn');
    if (buyAllBtn) {
        buyAllBtn.onclick = showPurchaseConfirmation;
    }
}

// Make removeFromCart globally accessible
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartSidebar();
    if (cart.length === 0) {
        hideCartSidebar();
    }
};

// Initialize cart functionality
function initializeCart() {
    // Update cart count on page load
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }

    // Initialize cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.onclick = function() {
            if (!document.getElementById('cartSidebar').classList.contains('show')) {
                showCartSidebar();
            } else {
                hideCartSidebar();
            }
        };
    }

    // Initialize close cart button
    const closeCartSidebar = document.getElementById('closeCartSidebar');
    if (closeCartSidebar) {
        closeCartSidebar.onclick = hideCartSidebar;
    }

    // Initialize cart sidebar
    renderCartSidebar();
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality if cart elements exist
    if (document.getElementById('cartBtn')) {
        initializeCart();
    }

    // Initialize product info modal elements
    const productInfoModal = document.getElementById('productInfoModal');
    const modalProductTitle = document.getElementById('modalProductTitle');
    const modalProductDetails = document.getElementById('modalProductDetails');
    const modalSize = document.getElementById('modalSize');
    const modalQty = document.getElementById('modalQty');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cancelProductInfoBtn = document.getElementById('cancelProductInfoBtn');
    const closeProductInfoModal = document.getElementById('closeProductInfoModal');

    // Example product info data (expand as needed)
    const productInfoData = {
        'Boxy Hoodie Chambredelavain - CHMB Basic White': 'Lebar dada: 60cm, Panjang: 72cm, Bahan: Fleece, Warna: Putih',
        'Spray Tee': 'Lebar dada: 54cm, Panjang: 70cm, Bahan: Cotton, Warna: Putih',
        'Boxy Hoodie Chambredelavain - CHMB Star': 'Lebar dada: 60cm, Panjang: 72cm, Bahan: Fleece, Warna: Hitam',
        'Boxy Hoodie Chambredelavain - CHMB': 'Lebar dada: 60cm, Panjang: 72cm, Bahan: Fleece, Warna: Abu',
        'Boxy Hoodie Zip Chambredelavain - CHMB': 'Lebar dada: 60cm, Panjang: 72cm, Bahan: Fleece, Warna: Hitam',
        'Boxy Hoodie Chambredelavain x Telepati.che - CHMB X TELEPATI.CHE': 'Lebar dada: 60cm, Panjang: 72cm, Bahan: Fleece, Kolaborasi',
        'Tee Chambredelavain x Telepati.che - CHMB X TELEPATI.CHE': 'Lebar dada: 54cm, Panjang: 70cm, Bahan: Cotton, Kolaborasi',
    };
    let currentModalProduct = { title: '', price: 0 };

    function showCartSidebar() {
        renderCartSidebar();
        cartSidebar.classList.remove('hidden');
        setTimeout(() => {
            cartSidebar.classList.add('show');
        }, 10);
    }

    function hideCartSidebar() {
        cartSidebar.classList.remove('show');
        setTimeout(() => {
            cartSidebar.classList.add('hidden');
        }, 300);
    }

    function renderCartSidebar() {
        if (!cartSidebarContent) return;
        
        if (cart.length === 0) {
            cartSidebarContent.innerHTML = '<p class="text-center p-4">Your cart is empty</p>';
            return;
        }

        let total = 0;
        let html = '<div class="p-4">';
        
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            html += `
                <div class="mb-4 p-2 border-b">
                    <h3 class="font-semibold">${item.title}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Quantity: ${item.qty}</p>
                    <p>Price: ${formatRupiah(item.price * item.qty)}</p>
                    <button onclick="removeFromCart(${index})" class="text-red-500 mt-2">Remove</button>
                </div>
            `;
        });            html += `            <div class="mt-4 pt-4 border-t">
                <h3 class="font-semibold">Total: ${formatRupiah(total)}</h3>
                <button id="buyAllBtn" class="btn-buy" style="margin-top:16px;background:linear-gradient(90deg, #ffdd00 60%, #ffe066 100%);padding:12px 0;font-size:1rem;letter-spacing:0.5px;color:#111;">Beli Sekarang</button>
            </div>
        </div>`;

        cartSidebarContent.innerHTML = html;
        
        // Add click handler for buy button
        const buyAllBtn = document.getElementById('buyAllBtn');
        if (buyAllBtn) {
            buyAllBtn.onclick = showPurchaseConfirmation;
        }
    }    // Make removeFromCart globally accessible
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        renderCartSidebar();
        if (cart.length === 0) {
            hideCartSidebar();
        }
    };

    Array.from(document.querySelectorAll('.btn-buy')).forEach(btn => {
        btn.addEventListener('click', function() {
            currentModalProduct.title = this.dataset.title;
            currentModalProduct.price = parseInt(this.dataset.price);
            modalProductTitle.textContent = currentModalProduct.title;
            modalProductDetails.textContent = productInfoData[currentModalProduct.title] || '';
            modalSize.value = '';
            modalQty.value = 1;
            modalTotalPrice.textContent = formatRupiah(currentModalProduct.price);
            productInfoModal.classList.remove('hidden');
        });
    });

    modalQty.addEventListener('input', function() {
        let qty = parseInt(modalQty.value) || 1;
        modalTotalPrice.textContent = formatRupiah(currentModalProduct.price * qty);
    });

    addToCartBtn.onclick = function() {
        const size = modalSize.value;
        const qty = parseInt(modalQty.value) || 1;
        if (!size) {
            modalSize.focus();
            return;
        }
        // Add to cart logic
        const found = cart.find(item => item.title === currentModalProduct.title && item.size === size);
        if (found) {
            found.qty += qty;
        } else {        cart.push({ title: currentModalProduct.title, price: currentModalProduct.price, size, qty });
        }
        saveCart();
        // Update cart count badge
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
        
        // First close the modal completely
        productInfoModal.classList.add('hidden');
        
        // Then update and show cart sidebar
        renderCartSidebar();
        cartSidebar.classList.remove('hidden');
        setTimeout(() => {
            cartSidebar.classList.add('show');
            cartSidebar.scrollTop = 0;
        }, 10);
    };

    cancelProductInfoBtn.onclick = closeProductInfoModal.onclick = function() {
        productInfoModal.classList.add('hidden');
    };

    // Initialize cart sidebar
    renderCartSidebar();

    // Set product item animation indices
    document.querySelectorAll('.produk-item').forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
});

function showPurchaseConfirmation() {
    const purchaseAlert = document.getElementById('purchaseAlert');
    const alertDetails = document.getElementById('alertDetails');
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');
    const cancelPurchaseBtn = document.getElementById('cancelPurchaseBtn');
    
    // Generate purchase details HTML
    let detailsHtml = '<div class="purchase-items" style="max-height:60vh;overflow-y:auto;">';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.qty;
        detailsHtml += `
            <div class="purchase-item" style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #eee;">
                <h4 style="font-weight:600;margin-bottom:4px;">${item.title}</h4>
                <p>Ukuran: ${item.size}</p>
                <p>Jumlah: ${item.qty}</p>
                <p>Harga: ${formatRupiah(item.price * item.qty)}</p>
            </div>
        `;
    });
    
    detailsHtml += `
        <div class="purchase-total" style="margin-top:16px;padding-top:12px;border-top:2px solid #ddd;">
            <h3 style="font-weight:bold;">Total: ${formatRupiah(total)}</h3>
        </div>
    `;
    
    alertDetails.innerHTML = detailsHtml;
    purchaseAlert.classList.remove('hidden');
    
    // Handle purchase confirmation
    confirmPurchaseBtn.onclick = function() {
        purchaseAlert.classList.add('hidden');
        setTimeout(() => {            alert('Pembelian berhasil! Terima kasih telah berbelanja.');
            cart = [];
            saveCart();
            const cartCount = document.getElementById('cartCount');
            if (cartCount) cartCount.textContent = '0';
            renderCartSidebar();
            hideCartSidebar();
        }, 100);
    };
    
    // Handle purchase cancellation
    cancelPurchaseBtn.onclick = function() {
        purchaseAlert.classList.add('hidden');
    };
}

// --- Login Page Logic ---
const users = [
    { username: "juen", password: "juen" },
    { username: "agung", password: "agung" },
    { username: "putra", password: "putra" },
    { username: "sam", password: "sam" },
    { username: "yopan", password: "yopan" }
];

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Successful login
        errorMessage.style.display = 'none';
        window.location.href = 'beranda.html';
    } else {
        // Failed login
        errorMessage.style.display = 'block';
    }
    
    return false;
}

// Scroll Animation Observer
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations with more generous margins
    const observerOptions = {
        root: null,
        rootMargin: '50px', // Increased margin to detect elements sooner
        threshold: 0.1 // Lower threshold to trigger earlier
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('scroll-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Function to prepare element for animation
    function prepareForAnimation(element, delay = 0) {
        element.classList.add('scroll-animate');
        element.style.transitionDelay = `${delay}s`;
        scrollObserver.observe(element);
    }

    // Observe hero section elements
    const heroElements = document.querySelectorAll('.hero h2, .hero p, .hero .btn');
    heroElements.forEach((el, index) => {
        prepareForAnimation(el, index * 0.2);
    });

    // Observe benefit items
    document.querySelectorAll('.benefit-item').forEach((el, index) => {
        prepareForAnimation(el, index * 0.2);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((el, index) => {
        prepareForAnimation(el, index * 0.2);
    });

    // Observe about section
    document.querySelectorAll('.tentang h2, .tentang p').forEach((el, index) => {
        prepareForAnimation(el, index * 0.2);
    });

    // Observe CTA section
    const ctaElements = document.querySelectorAll('.home-cta .container h2, .home-cta .container .btn');
    ctaElements.forEach((el, index) => {
        prepareForAnimation(el, index * 0.2);
    });
});