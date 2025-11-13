const mongoose = require('mongoose');
const Product = require('./src/models/product.model');
require('dotenv').config();

const products = [
  { title: "Procesador Intel i7 12700K", description: "Intel Core i7 12ª generación", price: 50000, category: "componente", stock: 10, image: "intel_i7.png" },
  { title: "Procesador AMD Ryzen 7 5800X", description: "AMD Ryzen 7, 8 núcleos", price: 45000, category: "componente", stock: 8, image: "ryzen7.png" },
  { title: "Motherboard ASUS ROG Z690", description: "Placa base gaming con chipset Z690", price: 25000, category: "componente", stock: 5, image: "motherboard.png" },
  { title: "Memoria RAM 16GB DDR4", description: "Memoria RAM DDR4 3200MHz", price: 15000, category: "componente", stock: 15, image: "ram16gb.png" },
  { title: "Disco SSD 1TB NVMe", description: "SSD NVMe de alta velocidad", price: 12000, category: "componente", stock: 20, image: "ssd1tb.png" },
  { title: "Placa de Video NVIDIA RTX 4070", description: "GPU potente para gaming y edición", price: 180000, category: "componente", stock: 3, image: "rtx4070.png" },
  { title: "Fuente 650W Modular", description: "Fuente de poder eficiente y silenciosa", price: 9500, category: "componente", stock: 8, image: "fuente650w.png" },
  { title: "Gabinete ATX Mid Tower", description: "Gabinete con buen flujo de aire", price: 8000, category: "periferica", stock: 12, image: "gabinete.png" },
  { title: "Monitor 27\" 144Hz", description: "Monitor gaming 144Hz Full HD", price: 60000, category: "monitor", stock: 6, image: "monitor27.png" },
  { title: "Teclado Mecánico RGB", description: "Teclado mecánico con retroiluminación RGB", price: 12000, category: "teclado", stock: 15, image: "teclado.png" },
  { title: "Mouse Gaming 16000 DPI", description: "Mouse ergonómico para gaming", price: 7000, category: "mouse", stock: 20, image: "mouse.png" },
  { title: "Auriculares Gaming con Micrófono", description: "Auriculares con sonido envolvente", price: 9000, category: "audifonos", stock: 10, image: "auriculares.png" },
  { title: "Cooler para CPU", description: "Refrigeración para procesadores", price: 5000, category: "componente", stock: 12, image: "cooler.png" },
  { title: "Placa de Captura 4K", description: "Para streaming y grabación en 4K", price: 22000, category: "periferica", stock: 4, image: "placa_captura.png" },
  { title: "Webcam HD 1080p", description: "Webcam para videollamadas y streaming", price: 4000, category: "periferica", stock: 18, image: "webcam.png" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.insertMany(products);
    console.log("✅ Productos de PC insertados correctamente");
    process.exit(0);
  })
  .catch(err => console.error(err));
