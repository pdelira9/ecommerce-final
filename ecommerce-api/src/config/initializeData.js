import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import User from "../models/user.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

async function generateUsers() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Users already exist in the database");
      return;
    }

    const defaultUsers = [
      {
        displayName: "Pedro Admin",
        userName: "corebyte_admin",
        email: "admin@corebyte.tech",
        hashPassword: await bcrypt.hash("AdminCorebyte123!", 10),
        role: "admin",
        avatar: faker.image.avatar(),
        phone: "4490000000",
        dateOfBirth: "1992-05-10",
        isActive: true,
      },
      {
        displayName: "Soporte CoreByte",
        userName: "soporte_corebyte",
        email: "soporte@corebyte.tech",
        hashPassword: await bcrypt.hash("SoporteCorebyte123!", 10),
        role: "admin",
        avatar: faker.image.avatar(),
        phone: "4491111111",
        dateOfBirth: "1995-08-20",
        isActive: true,
      },
      {
        displayName: "Cliente Demo",
        userName: "cliente_demo",
        email: "cliente@ejemplo.com",
        hashPassword: await bcrypt.hash("ClienteDemo123!", 10),
        role: "customer",
        avatar: faker.image.avatar(),
        phone: "5555555555",
        dateOfBirth: "2000-10-10",
        isActive: true,
      },
    ];

    await User.insertMany(defaultUsers);
    console.log("Default users created");
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
}

async function generateCategories() {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      console.log("Categories already exist in the database");
      return await Category.find();
    }

    const mainCategories = [
      { name: "Laptops", description: "Laptops para trabajo, estudio y gaming." },
      { name: "PCs de Escritorio", description: "Equipos armados y workstations de alto rendimiento." },
      { name: "Monitores", description: "Monitores Full HD, 2K y 4K para gaming y productividad." },
      { name: "Teclados y Mouse", description: "Periféricos mecánicos, inalámbricos y gamer." },
      { name: "Accesorios", description: "Pads, hubs USB, bases para laptop y más." },
    ];

    const created = await Category.insertMany(
      mainCategories.map((c) => ({
        ...c,
        imageUrl: `https://loremflickr.com/640/480/technology?lock=${faker.number.int(999999)}`,
      }))
    );

    console.log("Default categories created");
    return created;
  } catch (error) {
    console.error("Error creating categories:", error);
  }
}

function build50ProductsByCategory(categoryName) {
  // 10 productos por categoría = 50 total
  if (categoryName === "Laptops") {
    return [
      { name: "Laptop Core i5 16GB 512GB SSD", description: "Equilibrio perfecto para oficina y estudio.", tag: "laptop" },
      { name: "Laptop Core i7 16GB 1TB SSD", description: "Rendimiento superior para multitarea y productividad.", tag: "laptop,office" },
      { name: "Laptop Ryzen 5 16GB 512GB SSD", description: "Excelente para trabajo diario y uso general.", tag: "laptop" },
      { name: "Laptop Ryzen 7 32GB 1TB SSD", description: "Ideal para tareas exigentes y proyectos pesados.", tag: "laptop" },
      { name: "Laptop Gamer RTX 4060 16GB", description: "Gaming Full HD fluido y edición ligera.", tag: "laptop,gaming" },
      { name: "Laptop Gamer RTX 4070 32GB", description: "Alto rendimiento para AAA y creación de contenido.", tag: "laptop,gaming" },
      { name: "Ultrabook 14'' Ryzen 7", description: "Ligera y con gran batería para movilidad.", tag: "laptop" },
      { name: "Ultrabook 13'' Core i7", description: "Compacta, premium y muy rápida.", tag: "laptop" },
      { name: "Laptop 2-en-1 Touch 14''", description: "Convertible para estudio, notas y presentaciones.", tag: "laptop" },
      { name: "Laptop Creator OLED 2K", description: "Pantalla OLED para diseño, foto y video.", tag: "laptop" },
    ];
  }

  if (categoryName === "PCs de Escritorio") {
    return [
      { name: "PC Gamer Ryzen 7 RTX 4070 32GB", description: "Gaming AAA en calidad alta/ultra.", tag: "computer,gaming" },
      { name: "PC Gamer Core i7 RTX 4060 16GB", description: "Excelente para 1080p/1440p con gran FPS.", tag: "computer,gaming" },
      { name: "PC Oficina Core i3 8GB 256GB SSD", description: "Ofimática y navegación rápida.", tag: "computer,office" },
      { name: "PC Oficina Ryzen 5 16GB 512GB SSD", description: "Multitarea fluida para trabajo diario.", tag: "computer,office" },
      { name: "Workstation Ryzen 9 64GB 2TB SSD", description: "Edición, 3D y render pesado sin límites.", tag: "computer,workstation" },
      { name: "Workstation Core i9 64GB 2TB SSD", description: "Máximo rendimiento para producción.", tag: "computer,workstation" },
      { name: "Mini PC Core i5 16GB 512GB", description: "Compacta, silenciosa y poderosa.", tag: "computer" },
      { name: "PC Streaming Ryzen 7 32GB", description: "Perfecta para stream + gaming.", tag: "computer,gaming" },
      { name: "PC Render NVIDIA 32GB", description: "Optimizada para proyectos creativos.", tag: "computer,workstation" },
      { name: "PC All-Rounder Ryzen 5 16GB", description: "Equilibrada para todo tipo de uso.", tag: "computer" },
    ];
  }

  if (categoryName === "Monitores") {
    return [
      { name: "Monitor 24'' 144Hz Full HD", description: "Ideal para competitivo: fluidez total.", tag: "monitor,gaming" },
      { name: "Monitor 27'' 165Hz 2K IPS", description: "Perfecto para gaming + productividad.", tag: "monitor" },
      { name: "Monitor 32'' 4K UHD", description: "Gran pantalla para edición y multitarea.", tag: "monitor,4k" },
      { name: "Monitor 24'' 75Hz IPS", description: "Excelente para oficina y estudio.", tag: "monitor" },
      { name: "Monitor 27'' 240Hz", description: "Ultra competitivo para esports.", tag: "monitor,gaming" },
      { name: "Monitor Curvo 34'' Ultrawide", description: "Inmersión y espacio para trabajar.", tag: "monitor" },
      { name: "Monitor 27'' 4K IPS", description: "Detalles nítidos para diseño.", tag: "monitor,4k" },
      { name: "Monitor 32'' 165Hz 2K", description: "Pantalla grande con alta tasa.", tag: "monitor,gaming" },
      { name: "Monitor 24'' 165Hz", description: "Gaming rápido con bajo input lag.", tag: "monitor,gaming" },
      { name: "Monitor 27'' IPS 100Hz", description: "Mejor fluidez para productividad.", tag: "monitor" },
    ];
  }

  if (categoryName === "Teclados y Mouse") {
    return [
      { name: "Teclado Mecánico RGB Switch Red", description: "Lineal, rápido y silencioso para gaming.", tag: "keyboard" },
      { name: "Teclado Mecánico Switch Blue", description: "Táctil y clicky, ideal para escribir.", tag: "keyboard" },
      { name: "Teclado 75% Inalámbrico RGB", description: "Compacto, moderno y portátil.", tag: "keyboard" },
      { name: "Teclado Full Size Oficina", description: "Cómodo para trabajo diario.", tag: "keyboard" },
      { name: "Mouse Gamer 16000 DPI RGB", description: "Sensor preciso y gran ergonomía.", tag: "mouse,gaming" },
      { name: "Mouse Inalámbrico Silencioso", description: "Perfecto para oficina y estudio.", tag: "mouse" },
      { name: "Mouse Ultraligero Gaming", description: "Movimientos rápidos y control total.", tag: "mouse,gaming" },
      { name: "Combo Teclado + Mouse Inalámbrico", description: "Escritorio limpio y sin cables.", tag: "keyboard,mouse" },
      { name: "Teclado TKL Mecánico RGB", description: "Más espacio para el mouse, ideal gamer.", tag: "keyboard" },
      { name: "Mouse Vertical Ergonómico", description: "Comodidad para largas jornadas.", tag: "mouse" },
    ];
  }

  // Accesorios
  return [
    { name: "Pad para Mouse XXL RGB", description: "Mousepad extendido con luz RGB.", tag: "technology" },
    { name: "Base Refrigerante para Laptop", description: "Mejora ventilación y rendimiento.", tag: "laptop,cooling" },
    { name: "Hub USB-C 7 en 1", description: "HDMI + USB + SD para expandir puertos.", tag: "technology,usb" },
    { name: "Soporte Vertical para Laptop", description: "Ahorra espacio y ordena tu escritorio.", tag: "technology" },
    { name: "Brazo Soporte para Monitor", description: "Ergonomía y ajuste total.", tag: "monitor" },
    { name: "Cable HDMI 2.1 2m", description: "Ideal para 4K/120Hz y consolas.", tag: "technology" },
    { name: "Mouse Bungee", description: "Cable del mouse sin estorbar.", tag: "technology" },
    { name: "SSD Externo 1TB USB-C", description: "Almacenamiento rápido portátil.", tag: "technology" },
    { name: "Webcam Full HD", description: "Videollamadas claras y fluidas.", tag: "technology" },
    { name: "Audífonos Gamer con Micrófono", description: "Sonido envolvente y voz clara.", tag: "technology" },
  ];
}

async function generateProducts() {
  try {
    const productsCount = await Product.countDocuments();
    if (productsCount > 0) {
      console.log("Products already exist in the database");
      return;
    }

    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      console.log("No categories available to create products");
      return;
    }

    const products = [];

    for (const category of categories) {
      const items = build50ProductsByCategory(category.name);

      for (const item of items) {
        products.push({
          name: item.name,
          description: item.description,
          price: Number(faker.commerce.price({ min: 800, max: 40000 })),
          offer: faker.number.int({ min: 0, max: 30 }),
          stock: faker.number.int({ min: 5, max: 50 }),
          imageUrl: `https://loremflickr.com/800/600/${item.tag}?lock=${faker.number.int(999999)}`,
          category: category._id,
        });
      }
    }

    await Product.insertMany(products);
    console.log("Default products created (50)");
  } catch (error) {
    console.error("Error creating products:", error);
  }
}

async function initializeData() {
  try {
    await generateUsers();
    await generateCategories();
    await generateProducts();
    console.log("Data initialized successfully");
  } catch (error) {
    console.error("Error on initialize data:", error);
  }
}

export default initializeData;
