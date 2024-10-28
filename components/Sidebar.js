export default function Sidebar({ categories, onCategorySelect, selectedCategory }) {
    return (
        <div style={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            height: 'calc(100vh - 60px)', // Subtract navbar height
            position: 'fixed',
            top: '60px', // Start below navbar
            left: 0,
            color: '#ffffff',
            overflowY: 'auto',
            boxSizing: 'border-box'
        }}>
            <h2 style={{
                borderBottom: '2px solid #ffffff',
                paddingBottom: '10px',
                marginBottom: '20px'
            }}>
                Categories
            </h2>
            <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0 
            }}>
                {categories.map(category => (
                    <li 
                        key={category}
                        onClick={() => onCategorySelect(category)}
                        style={{
                            padding: '12px 15px',
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: selectedCategory === category ? '#333' : 'transparent',
                            textDecoration: 'underline',
                            transition: 'all 0.3s ease',
                            ':hover': {
                                backgroundColor: '#333'
                            }
                        }}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </div>
    );
}
