let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

const addDataToHTML = () => {
    // Group products by category
    const categorizedProducts = {};

    products.forEach(product => {
        if (!categorizedProducts[product.category]) {
            categorizedProducts[product.category] = [];
        }
        categorizedProducts[product.category].push(product);
    });

    // Iterate over categories and append products to respective sections
    for (const category in categorizedProducts) {
        if (categorizedProducts.hasOwnProperty(category)) {
            const categoryProducts = categorizedProducts[category];

            // Create a section for each category
            const categorySection = document.createElement('div');
            categorySection.classList.add('category-section');
            categorySection.innerHTML = `<h2>${category}</h2>`;
            
            // Append products to the category section
            categoryProducts.forEach(product => {
                const newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = `
                <div class="productView">
                    <div class="product" onclick="showDetails('${product.id}')">
                        <img src="${product.image}" alt="">
                        <h4>${product.name}</h4>
                        <div class="price">R${product.price}</div>
                        <p>${product.stock}</p>
                    </div>
                    <div class="product-details" id="${product.id}">
                        <h4>Item: ${product.items}</h4>
                        <p>Price: R${product.price}</p>
                        <p>Color: ${product.color}</p>
                        <p>Size: ${product.size}</p>
                        <p>${product.details}</p>    
                    </div>
                </div>
                <button class="addCart">Add To Cart</button>`;
                categorySection.appendChild(newProduct);
            });

            // Append the category section to the main product list
            listProductHTML.appendChild(categorySection);
        }
    }
}

    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">R${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span id="quan">${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

//create new variable
const newName = document.createElement('nameUser')
const newEmail = document.createElement('emailUser')
const newAddress = document.createElement('addressUser')
const userChoice = document.createElement('userList')
// create function for button
const addtoForm = document.getElementById("check")
addtoForm.onclick = function(){
    //simplyfy getting values for html
    let name = document.getElementById("userName").value
    let email = document.getElementById("userEmail").value
    let address = document.getElementById("userAddress").value
    let list = document.getElementById("cartList").innerText
    // newName.textContent = document.getElementById("userName").value

    // replace variables with values
    newName.textContent = name;
    newEmail.textContent = email;
    newAddress.textContent = address;
    userChoice.textContent = list;

    //append to html
    // document.getElementById("nameUser").append(newName);
    // document.getElementById("emailUser").append(newEmail);
    // document.getElementById("addressUser").append(newAddress);
    // document.getElementById("userList").append(userChoice);
    console.log(list, name, email, address);

    localStorage.setItem('formData', JSON.stringify({ list, name, email, address}));
    window.location.href = 'QuoteSubmit.html';
}

const initApp = () => {
    // get data product
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();