import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function Cart() {
    const { getCartCount } = useCart();

    return (
        <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 1000 
        }}>
            <Link href="/order-shipment">
                <button style={{
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                    ':hover': {
                        backgroundColor: '#0056b3',
                        transform: 'scale(1.05)'
                    }
                }}>
                    🛒 Cart ({getCartCount()})
                </button>
            </Link>
        </div>
    );
}
