const express =require("express");
const app =express();
app.use(express.json());

let products = [
    {
        id: 301,
        name:"Wireless Mouse",
        category:"Electronics",
        price:799,
        quantity:25,
        inStock:true
    },
    {
        id:302,
        name:"Notebook",
        category:"Stationery",
        price:60,
        quantity:100,
        inStock:true
    },
    {
        id: 303,
        name:"USB Keyboard",
        category:"Electronics",
        price:999,
        quantity:0,
        inStock:false
    }
];

const generateId =()=> {
    return products.length===0
        ? 301
        : Math.max(...products.map(product => product.id)) + 1;
};

function validateProduct(data) {
    return (
        data &&
        typeof data.name ==="string" &&
        data.name.trim() !=="" &&
        typeof data.category ==="string" &&
        data.category.trim() !=="" &&
        typeof data.price ==="number" &&
        data.price >= 0 &&
        typeof data.quantity ==="number" &&
        data.quantity >= 0 &&
        typeof data.inStock ==="boolean"
    );
}

app.get("/api/products", (req, res) => {
    res.status(200).json(products);
});

app.post("/api/products", (req, res) => {
    const data = req.body;

    if (!validateProduct(data)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const newProduct = {
        id: generateId(),
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        inStock: data.inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.get("/api/products/filter",(req, res) => {
    const category = req.query.category;
    if (!category) {
        return res.status(400).json({
            message:"Category is required"
        });
    }
    const result =products.filter(product =>
        product.category.toLowerCase() ===category.toLowerCase()
    );
    res.status(200).json(result);
});
app.get("/api/products/:id",(req, res) => {
    const id = Number(req.params.id);
    const product = products.find(product => product.id === id);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    res.status(200).json(product);
});
app.put("/api/products/:id", (req, res)=> {
    const id = Number(req.params.id);
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    if (!validateProduct(req.body)) {
        return res.status(400).json({
            message: "Invalid product data"
        });
    }

    const updatedProduct ={
        id: id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        inStock: req.body.inStock
    };
    products[index] =updatedProduct;
    res.status(200).json(updatedProduct);
});
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    products.splice(index, 1);
    res.status(200).json({
        message: "Product deleted successfully"
    });
});
app.use((err, req, res, next) =>{
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON"
        });
    }
    next(err);
});
module.exports = app;

