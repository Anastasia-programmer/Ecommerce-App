import books from '../../src/data/products.js'
import Product from './models/Product.js'

// Fills an empty products collection with the 20 books of the TP2 React catalog
export async function seedProducts() {
  if ((await Product.estimatedDocumentCount()) > 0) return

  await Product.insertMany(
    books.map((book) => ({
      name: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      category: book.category,
      imageUrl: '', // covers are drawn in code by the React <BookCover /> component
      stock: 20,
    })),
  )
  console.log(`Seeded ${books.length} products`)
}
