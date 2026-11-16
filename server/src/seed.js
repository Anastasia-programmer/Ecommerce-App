import books from './data/books.js'
import Product from './models/Product.js'

// Fills an empty products collection with the 20 books of the Maktaba shop
export async function seedProducts() {
  if ((await Product.estimatedDocumentCount()) > 0) return

  // imageUrl stays empty: the React <BookCover /> component draws the covers in code
  await Product.insertMany(books.map((book) => ({ ...book, imageUrl: '', stock: 20 })))
  console.log(`Seeded ${books.length} products`)
}
