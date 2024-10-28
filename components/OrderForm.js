import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { generateRandomDimensions } from '../utils/randomDimensions';
import { createLogisticsPlugin } from '../plugins/logistics';
import LogisticsPlugin from '../plugins/logistics/share-logistics-plugin';
import DatePicker from 'react-datepicker';
import Link from 'next/link';
import "react-datepicker/dist/react-datepicker.css";

export default function OrderForm() {
    const { cartItems } = useCart();
    const [packageDimensions, setPackageDimensions] = useState(null);
    const [errors, setErrors] = useState({});
    const logisticsPluginInst = createLogisticsPlugin(
        process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'
    );
    const [paymentDetails, setPaymentDetails] = useState({
        creditCardNumber: '',
        cvv: '',
        expiryDate: new Date(),
        cardTitle: ''
    });

    const [shipmentDetails, setShipmentDetails] = useState({
        name: '',
        email: '',
        phone: '',
        fullAddress: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
        }
    });

    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Alert styles
    const alertStyles = {
        success: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'slideIn 0.5s ease-out'
        },
        error: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'slideIn 0.5s ease-out'
        }
    };

    const handleSubmit = async (orderData) => {
        const logisticsPlugin = new LogisticsPlugin({
            apiEndpoint: logisticsPluginInst
        });
        logisticsPlugin.placeOrder(orderData, (error, result) => {
            if (error) {
                showAlert(`Failed to submit order: ${error || 'Unknown error'}`, 'error');
                console.error('Order submission failed:', result);
                return;
            }
            
            showAlert('Order submitted successfully! 🎉', 'success');
            console.log('Order submitted successfully:', result);
            // Handle success
        });      
    };
    // Show alert function
    const showAlert = (message, type) => {
        setAlert({
            show: true,
            message,
            type
        });

        // Hide alert after 3 seconds
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 3000);
    };

    useEffect(() => {
        const dimensions = generateRandomDimensions(cartItems.length);
        setPackageDimensions(dimensions);
    }, [cartItems.length]);

    // Validation functions
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Payment handlers
    const handleCreditCardChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
        setPaymentDetails(prev => ({
            ...prev,
            creditCardNumber: value
        }));
    };

    const handleCVVChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setPaymentDetails(prev => ({
            ...prev,
            cvv: value
        }));
    };

    // Shipment handlers
    const handleShipmentChange = (e) => {
        const { name, value } = e.target;
        setShipmentDetails(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (name === 'email' && value) {
            if (!validateEmail(value)) {
                setErrors(prev => ({
                    ...prev,
                    email: 'Please enter a valid email address'
                }));
            }
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShipmentDetails(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        autoComplete: 'off'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500'
    };

    const requiredLabel = (text) => (
        <label style={labelStyle}>
            {text} <span style={{ color: 'red' }}>*</span>
        </label>
    );

    const formatOrderData = () => {
        return {
            orderIds: [548971],
            organizationId: 775,
            sellerInfo: {
                name: "John Seller",
                email: "john.seller@example.com",
                phone: "+123456789",
                fullAddress: "5363 Tara Hill Dr, Dublin, OH 43017, USA",
                address: {
                    street: "5363 Tara Hill Dr",
                    city: "Dublin",
                    state: "OH",
                    zipcode: "43017",
                    country: "USA"
                }
            },
            customerInfo: {
                name: shipmentDetails.name,
                email: shipmentDetails.email,
                phone: shipmentDetails.phone,
                fullAddress: shipmentDetails.fullAddress,
                address: {
                    street: shipmentDetails.address.street,
                    city: shipmentDetails.address.city,
                    state: shipmentDetails.address.state,
                    zipcode: shipmentDetails.address.zipcode,
                    country: shipmentDetails.address.country
                }
            },
            packageInfo: {
                weight: packageDimensions.weight.toFixed(1),
                dimensions: {
                    length: parseFloat(packageDimensions.length).toFixed(1),
                    width: parseFloat(packageDimensions.width).toFixed(1),
                    height: parseFloat(packageDimensions.height).toFixed(1)
                },
                quantity: cartItems.length
            }
        };
    };

    const submitOrder = async (orderData) => {
        try {
            const response = await fetch('https://dev-share-api-pr-2750.apps.sharemobility.com/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                showAlert('Order submitted successfully! 🎉', 'success');
                console.log('Order submitted successfully:', result);
                // Optional: Clear form or redirect
            } else {
                showAlert(`Failed to submit order: ${result.message || 'Unknown error'}`, 'error');
                console.error('Order submission failed:', result);
            }

        } catch (error) {
            showAlert('Error submitting order. Please try again.', 'error');
            console.error('Error submitting order:', error);
        }
    };

    return (
        <div style={{ display: 'flex', marginTop: '60px' }}>
            {/* Alert Component */}
            {alert.show && (
                <div style={alertStyles[alert.type]}>
                    {alert.message}
                </div>
            )}

            {/* Cart Sidebar with scroll */}
            <div style={{
                width: '300px',
                backgroundColor: '#1a1a1a',
                height: 'calc(100vh - 60px)',
                position: 'fixed',
                left: 0,
                overflowY: 'auto', // Add scroll to entire sidebar
                color: '#ffffff'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: '#1a1a1a',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ margin: 0 }}>Cart Items</h2>
                        <Link href="/order">
                            <button style={{
                                padding: '8px 15px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}>
                                Back to Order
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Cart Items */}
                <div style={{
                    padding: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {cartItems.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '10px'
                                }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: '500'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <span style={{
                                        backgroundColor: '#007bff',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}>
                                        ${item.price}
                                    </span>
                                </div>

                                <p style={{
                                    margin: '5px 0 0 0',
                                    fontSize: '14px',
                                    color: '#aaa'
                                }}>
                                    {item.description}
                                </p>

                                <div style={{
                                    marginTop: '10px',
                                    padding: '5px 0',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '14px'
                                }}>
                                    Category: {item.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#1a1a1a',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '16px',
                        marginBottom: '10px'
                    }}>
                        <span>Total Items:</span>
                        <span>{cartItems.length}</span>
                    </div>

                    {packageDimensions && (
                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '15px'
                        }}>
                            <h4 style={{
                                margin: '0 0 10px 0',
                                fontSize: '14px',
                                color: '#fff',
                                fontWeight: '500'
                            }}>
                                Package Dimensions:
                            </h4>
                            <div style={{
                                fontSize: '13px',
                                color: '#ddd',
                                display: 'grid',
                                gap: '5px'
                            }}>
                                <div>Length: {packageDimensions.length.toFixed(1)} inches</div>
                                <div>Width: {packageDimensions.width.toFixed(1)} inches</div>
                                <div>Height: {packageDimensions.height.toFixed(1)} inches</div>
                                <div>Weight: {packageDimensions.weight.toFixed(1)} kgs</div>
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        padding: '10px 0',
                        borderTop: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <span>Total:</span>
                        <span>
                            ${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div style={{
                flex: 1,
                marginLeft: '300px',
                padding: '40px'
            }}>
                {/* Payment Details Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px' }}>Payment Details</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        maxWidth: '800px'
                    }}>
                        {/* Credit Card Number with Icons */}
                        <div>
                            <label style={labelStyle}>Credit Card Number</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={paymentDetails.creditCardNumber}
                                    onChange={handleCreditCardChange}
                                    placeholder="1234 5678 9012 3456"
                                    style={{
                                        ...inputStyle,
                                        paddingLeft: '40px'
                                    }}
                                    autoComplete="off"
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    display: 'flex',
                                    gap: '5px'
                                }}>
                                </div>
                            </div>
                        </div>

                        {/* CVV */}
                        <div>
                            <label style={labelStyle}>CVV</label>
                            <input
                                type="text"
                                value={paymentDetails.cvv}
                                onChange={handleCVVChange}
                                placeholder="123"
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label style={labelStyle}>Expiry Date</label>
                            <DatePicker
                                selected={paymentDetails.expiryDate}
                                onChange={date => setPaymentDetails(prev => ({
                                    ...prev,
                                    expiryDate: date
                                }))}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                minDate={new Date()}
                                customInput={
                                    <input style={inputStyle} />
                                }
                            />
                        </div>

                        {/* Card Title */}
                        <div>
                            <label style={labelStyle}>Card Title</label>
                            <input
                                type="text"
                                value={paymentDetails.cardTitle}
                                onChange={(e) => setPaymentDetails(prev => ({
                                    ...prev,
                                    cardTitle: e.target.value
                                }))}
                                placeholder="Name on card"
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipment Details Section */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>Shipment By SHARE</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        maxWidth: '800px'
                    }}>
                        {/* Basic Info */}
                        <div>
                            {requiredLabel('Name')}
                            <input
                                type="text"
                                name="name"
                                value={shipmentDetails.name}
                                onChange={handleShipmentChange}
                                style={inputStyle}
                                autoComplete="off"
                                required
                            />
                            {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
                        </div>

                        <div>
                            {requiredLabel('Email')}
                            <input
                                type="email"
                                name="email"
                                value={shipmentDetails.email}
                                onChange={handleShipmentChange}
                                style={inputStyle}
                                autoComplete="off"
                                required
                            />
                            {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>}
                        </div>

                        <div>
                            {requiredLabel('Phone')}
                            <input
                                type="tel"
                                name="phone"
                                value={shipmentDetails.phone}
                                onChange={handleShipmentChange}
                                style={inputStyle}
                                autoComplete="off"
                                required
                            />
                            {errors.phone && <div style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</div>}
                        </div>

                        <div>
                            {requiredLabel('Full Address')}
                            <input
                                type="text"
                                name="fullAddress"
                                value={shipmentDetails.fullAddress}
                                onChange={handleShipmentChange}
                                style={inputStyle}
                                autoComplete="off"
                                required
                            />
                            {errors.fullAddress && <div style={{ color: 'red', fontSize: '12px' }}>{errors.fullAddress}</div>}
                        </div>

                        {/* Detailed Address */}
                        <div>
                            <label style={labelStyle}>Street</label>
                            <input
                                type="text"
                                name="street"
                                value={shipmentDetails.address.street}
                                onChange={handleAddressChange}
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>City</label>
                            <input
                                type="text"
                                name="city"
                                value={shipmentDetails.address.city}
                                onChange={handleAddressChange}
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>State</label>
                            <input
                                type="text"
                                name="state"
                                value={shipmentDetails.address.state}
                                onChange={handleAddressChange}
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Zipcode</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={shipmentDetails.address.zipcode}
                                onChange={handleAddressChange}
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={shipmentDetails.address.country}
                                onChange={handleAddressChange}
                                style={inputStyle}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div style={{
                    maxWidth: '800px',
                    marginTop: '30px'
                }}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const newErrors = {};

                            // Validate required fields
                            if (!shipmentDetails.name) newErrors.name = 'Name is required';
                            if (!shipmentDetails.email) newErrors.email = 'Email is required';
                            else if (!validateEmail(shipmentDetails.email)) newErrors.email = 'Invalid email format';
                            if (!shipmentDetails.phone) newErrors.phone = 'Phone is required';
                            if (!shipmentDetails.fullAddress) newErrors.fullAddress = 'Full address is required';

                            if (Object.keys(newErrors).length > 0) {
                                setErrors(newErrors);
                                showAlert('Please fill in all required fields', 'error');
                                return;
                            }

                            // Format and submit order data
                            const orderData = formatOrderData();
                            console.log('Order Data:', orderData);
                            submitOrder(orderData);
                        }}
                        style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

// Add this CSS to your global styles
const globalStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
