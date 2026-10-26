import ProductCard from '../ProductCard/ProductCard'
import './ProductGrid.css'

/** Reusable grid: used by the shop page and the favorites page. */
export default function ProductGrid({ products, onOpenDetails }) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} onOpenDetails={onOpenDetails} />
      ))}
    </div>
  )
}
