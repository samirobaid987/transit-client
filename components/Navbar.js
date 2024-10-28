import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function Navbar() {
    const { getCartCount } = useCart();

    return (
        <nav style={{
            backgroundColor: '#1a1a1a',
            padding: '15px 30px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <Link href="/">
                <div style={{
                    color: '#ffffff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>
                    E-Shop
                </div>
            </Link>

            <Link href="/order-shipment">
                <button style={{
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    ':hover': {
                        backgroundColor: '#0056b3',
                        transform: 'scale(1.05)'
                    }
                }}>
                    🛒 Cart ({getCartCount()})
                </button>
            </Link>
        </nav>
    );
}
