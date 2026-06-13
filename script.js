// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Function to handle buy button clicks
function handleBuy(productName) {
    // In a real scenario, this would redirect to a checkout URL
    // e.g., window.location.href = "https://pay.hotmart.com/XXXXXX";
    
    alert(`🛒 Você selecionou: ${productName}\n\nAqui você colocará o seu link de pagamento (Hotmart, Kiwify, Mercado Pago, etc). O cliente será redirecionado para a tela de checkout.`);
}

// Fade-in animation on scroll using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once it has faded in
        }
    });
}, observerOptions);

// Select elements to animate
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = 0;
        card.style.transform = 'translateY(40px)';
        // Stagger the transition delay based on index for a cascading effect
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s, border-color 0.3s ease, box-shadow 0.3s ease`;
        
        fadeObserver.observe(card);
    });
    
    // Load custom products on start
    loadCustomProducts();
});

// --- Modal and Custom Products Logic ---
function openAddModal() {
    document.getElementById('addProductModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

function handleAddProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const link = document.getElementById('prodLink').value;
    const imageUrl = document.getElementById('prodImage').value;
    const imageFile = document.getElementById('prodImageFile').files[0];
    
    const finalizeProduct = (finalImage) => {
        const product = {
            name: name,
            price: price,
            link: link,
            image: finalImage,
            id: Date.now()
        };
        
        try {
            saveProduct(product);
            renderProduct(product);
            closeAddModal();
            event.target.reset();
        } catch (e) {
            alert("Erro ao salvar: a imagem escolhida é muito pesada para ficar salva no navegador. Tente uma imagem mais leve (abaixo de 2MB) ou use a opção de Link da Imagem.");
        }
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            finalizeProduct(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        finalizeProduct(imageUrl);
    }
}

function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('customProducts')) || [];
    products.push(product);
    localStorage.setItem('customProducts', JSON.stringify(products));
}

function loadCustomProducts() {
    let products = JSON.parse(localStorage.getItem('customProducts')) || [];
    products.forEach(product => renderProduct(product));
}

function renderProduct(product) {
    const addCard = document.querySelector('.add-product-card');
    
    // Use the provided image link, or fallback to a default gradient
    const imageStyle = product.image && product.image.trim() !== '' 
        ? `background-image: url('${product.image}'); background-color: #1e1e2f;` 
        : `background: linear-gradient(135deg, #1e1e2f, #4c2b82);`;
    
    const cardHTML = `
        <div class="product-card">
            <div class="card-image" style="${imageStyle}"></div>
            <div class="card-content">
                <span class="badge highlight">Novo</span>
                <h3>${product.name}</h3>
                <p>Produto adicionado manualmente.</p>
                <div class="price-row">
                    <span class="price">R$ ${product.price}</span>
                    <button class="btn-buy" onclick="window.location.href='${product.link}'">Acessar</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert before the add button
    if(addCard) {
        addCard.insertAdjacentHTML('beforebegin', cardHTML);
    }
}
