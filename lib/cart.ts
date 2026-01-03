/**
 * Cart utility functions for handling cart operations
 * Works with both localStorage (guests) and database (logged-in users)
 */

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

/**
 * Add item to cart (works for both guests and logged-in users)
 */
export async function addToCart(
  product: {
    id: string
    name: string
    price: string | number
    imageUrl: string
  },
  quantity: number = 1,
  isLoggedIn: boolean = false
): Promise<{ success: boolean; message: string }> {
  if (isLoggedIn) {
    // Add to database cart
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (response.ok) {
        return { success: true, message: 'Added to cart!' }
      } else {
        const error = await response.json()
        return { success: false, message: error.error || 'Failed to add to cart' }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: 'Failed to add to cart' }
    }
  } else {
    // Add to localStorage
    try {
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          imageUrl: product.imageUrl,
          quantity,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('storage'))
      return { success: true, message: 'Added to cart!' }
    } catch (error) {
      console.error('Error adding to localStorage cart:', error)
      return { success: false, message: 'Failed to add to cart' }
    }
  }
}

