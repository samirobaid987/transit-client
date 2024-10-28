import Link from 'next/link';

export default function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to Our E-Commerce Store</h1>
            <Link href="/order">
                <button style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Start Shopping
                </button>
            </Link>
        </div>
    );
}
