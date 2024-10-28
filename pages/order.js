import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ItemList from '../components/ItemList';
import Navbar from '../components/Navbar';

const categories = ['All', 'Electronics', 'Clothing', 'Books'];

export default function Order() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <div>
            <Navbar />
            <div style={{ 
                display: 'flex', 
                minHeight: '100vh',
                marginTop: '60px' // Space for navbar
            }}>
                <Sidebar 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                />
                <main style={{ 
                    flex: 1,
                    marginLeft: '250px', // Match sidebar width
                    backgroundColor: '#f8f9fa'
                }}>
                    <ItemList selectedCategory={selectedCategory} />
                </main>
            </div>
        </div>
    );
}
