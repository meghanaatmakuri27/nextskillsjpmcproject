// PaymentPage.js

import React, { useState } from 'react';
import '../App.css';

const PaymentPage = () => {
    const [formDetails, setFormDetails] = useState({
        name: '',
        email: '',
        phone: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const submitOrder = async () => {
        const options = {
            key: "rzp_test_pDBkyi8woO2mSC", // Enter your Razorpay Key ID
            amount: formDetails.amount * 100, // Amount is in currency subunits. Default currency is INR.
            currency: "INR",
            name: "Your Company Name",
            description: "Test Transaction",
            handler: async function (response) {
                alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);

                // After payment success, send details to backend to create order
                const orderDetails = {
                    ...formDetails,
                    razorpay_payment_id: response.razorpay_payment_id
                };

                console.log("Sending order details to backend:", orderDetails); // Debug statement

                const backendResponse = await fetch('http://localhost:9999/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderDetails)
                });

                const backendResult = await backendResponse.json();

                console.log("Backend response:", backendResult); // Debug statement

                if (backendResult.success) {
                    alert('Order created successfully. Order ID: ' + backendResult.order_id);
                } else {
                    alert('Failed to create order. Please try again.');
                }
            },
            prefill: {
                name: formDetails.name,
                email: formDetails.email,
                contact: formDetails.phone
            }
        };

        if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            alert('Razorpay SDK failed to load. Please try again later.');
        }
    };

    return (
        <div className="App">
            <h2>Order Form</h2>
            <form id="orderForm">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formDetails.name} onChange={handleChange} required /><br /><br />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formDetails.email} onChange={handleChange} required /><br /><br />

                <label htmlFor="phone">Phone:</label>
                <input type="tel" id="phone" name="phone" value={formDetails.phone} onChange={handleChange} required /><br /><br />

                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" value={formDetails.amount} onChange={handleChange} required /><br /><br />

                <button type="button" onClick={submitOrder}>Pay Now</button>
            </form>
        </div>
    );
};

export default PaymentPage;
