import { useCart } from '../context/CartContext';
import { items } from '../utils/dummyData';

export default function ItemList({ selectedCategory }) {
  const { addToCart } = useCart();
  
  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: '20px', 
      padding: '20px',
      backgroundColor: '#f8f9fa',
      boxSizing: 'border-box'
    }}>
      {filteredItems.map(item => (
        <div 
          key={item.id} 
          style={{
            border: '1px solid #dee2e6',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease',
            height: '200px', // Fixed height
            maxHeight: '200px', // Ensure consistent height
            boxSizing: 'border-box',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}          
        >
          <div>
            <h3 style={{ 
              margin: '0 0 10px 0', 
              color: '#1a1a1a',
              fontSize: '18px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.name}
            </h3>
            <p style={{ 
              color: '#666', 
              fontSize: '14px',
              margin: '0 0 15px 0',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.3'
            }}>
              {item.description}
            </p>
            <div style={{
              color: '#007bff',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              ${item.price.toFixed(2)}
            </div>
          </div>
          <button 
            onClick={() => addToCart(item)}
            style={{
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.2s ease',
              marginTop: 'auto',
              ':hover': {
                backgroundColor: '#0056b3'
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
