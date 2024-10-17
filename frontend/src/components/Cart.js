import React, { useState, useEffect } from "react";
import "./Cart.css";
import Axios from "axios";
import { FiTrash } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Cart = () => {
  const [productTotalAmt, setProductTotalAmt] = useState(0);
  const [shippingCharge] = useState(0);
  const [totalCartAmt, setTotalCartAmt] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const initialCount = localStorage.getItem("count") || 1;
  const [count, setCount] = useState(Number(initialCount));
  const [amount, setAmount] = useState(1);
  const [amount1, setAmount1] = useState(50);
  const [data, setData] = useState([]);
  const userLocalStorageEmail = localStorage.getItem("email");
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:9999/cart/");
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const decreaseNumber = (itemprice) => {
    if (itemprice >= 15) {
      setProductTotalAmt(productTotalAmt - 15);
      setTotalCartAmt(totalCartAmt - 15);
    }
  };

  const handleIncreaseCart = async (props) => {
    setCount(count + 1);
    const amount1 = amount * count;
    setAmount(amount1);
    try {
      const response = await Axios.post("http://localhost:9999/cart/add", {
        pid: props.pid,
        name: props.name,
        price: props.price,
        image: props.image,
        coins: props.coins,
        quantity: props.quantity + 1,
      });
      console.log("Added to cart:", response);
    } catch (error) {
      console.log("error sending data", error);
    }
  };

  const handleDecreaseCart = async (props) => {
    if (props.quantity > 1) {
      setCount(count - 1);

      try {
        const response = await Axios.post("http://localhost:9999/cart/add", {
          pid: props.pid,
          name: props.name,
          price: props.price,
          image: props.image,
          coins: props.coins,
          quantity: props.quantity - 1,
        });
        console.log("Item quantity decreased:", response);

        const updatedCart = data.map((cartItem) => {
          if (cartItem._id === props._id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            };
          }
          return cartItem;
        });
        setData(updatedCart);
      } catch (error) {
        console.log("Error sending data", error);
      }
    } else {
      try {
        await axios.delete(`http://localhost:9999/cart/delete/${props._id}`);
        const updatedCart = data.filter((cartItem) => cartItem._id !== props._id);
        setData(updatedCart);
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product: " + error);
      }
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.delete(`http://localhost:9999/cart/delete/${item._id}`);
      const updatedCart = data.filter((cartItem) => cartItem._id !== item._id);
      setData(updatedCart);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product: " + error);
    }
  };

  const increaseNumber = (itemprice) => {
    if (itemprice < 75) {
      setProductTotalAmt(productTotalAmt + 15);
      setTotalCartAmt(totalCartAmt + 15);
    }
  };

  const checkout = () => {
    // Perform any necessary calculations or operations before navigating to payment
    navigate('/payment'); // Navigate to '/payment' route
  };

  const applyDiscountCode = () => {
    if (discountCode === "thapa") {
      setTotalCartAmt(totalCartAmt - 15);
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
    }
  };

  const calculateTotalCartAmount = () => {
    let totalCartAmount = 0;

    for (const item of data) {
      totalCartAmount += item.price * item.quantity;
    }

    return totalCartAmount;
  };

  useEffect(() => {
    setTotalCartAmt(calculateTotalCartAmount() + shippingCharge);
  }, [data, shippingCharge]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10 col-8 mx-auto">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-10 col-11 mx-auto">
                <div className="row mt-4 gx-3">
                  <div className="col-md-12 col-lg-8 col-11 mx-auto main_cart mb-lg-0 mb-5 shadow">
                    <div className="card p-4">
                      <h2 className="py-4 font-weight-bold">
                        Cart ({data.length} items)
                      </h2>
                      <div className="row mt-3">
                        {data.length === 0 ? (
                          <h2>Your cart is empty</h2>
                        ) : (
                          data.map((item, index) => (
                            <div key={index} className="mb-8">
                              <div>
                                <div className="row">
                                  <div className="col-md-4 col-11 mx-auto bg-light d-flex justify-content-center align-items-center shadow product_img">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/Images/${item.image}`}
                                      className="img-fluid"
                                      alt="cart img"
                                      style={{
                                        width: "100px",
                                        height: "150px",
                                      }}
                                    />
                                  </div>
                                  <div className="col-md-8 col-11 mx-auto px-4 mt-2">
                                    <div className="row">
                                      <div className="col-8 card-title">
                                        <h1 className="mb-4 product_name">
                                          {item.name}
                                        </h1>
                                      </div>
                                      <div className="col-4">
                                        <ul className="pagination justify-content-end set_quantity">
                                          <li className="page-item">
                                            <button
                                              className="page-link"
                                              onClick={() =>
                                                handleDecreaseCart(item)
                                              }
                                            >
                                              <i className="fas fa-minus fa"></i>
                                            </button>
                                          </li>
                                          <li className="page-item">
                                            <input
                                              type="text"
                                              name=""
                                              className="page-link"
                                              value={item.quantity}
                                              readOnly
                                            />
                                          </li>
                                          <li className="page-item">
                                            <button
                                              className="page-link"
                                              onClick={() =>
                                                handleIncreaseCart(item)
                                              }
                                            >
                                              <i className="fas fa-plus fa"></i>
                                            </button>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end price_money">
                                      <h2>
                                        <span id="itemval">
                                          Rs{item.quantity * item.price}
                                        </span>
                                      </h2>
                                    </div>
                                    <div className="col-6 d-flex justify-content-between remove_wish">
                                      <div className="de">
                                        <button
                                          className="remove-item-button"
                                          onClick={() =>
                                            handleRemoveItem(item)
                                          }
                                        >
                                          <FiTrash className="fi-trash-icon" />
                                          REMOVE ITEM
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-13 col-lg-4 col-12 mt-lg-0 mt-md-9">
                    <div className="right_side p-3 shadow bg-white">
                      <h2 className="product_name mb-5">The Total Amount Of</h2>
                      <div className="price_indiv d-flex justify-content-between">
                        <p>Product amount</p>
                        <p>
                          Rs{" "}
                          <span id="product_total_amt">
                            {calculateTotalCartAmount()}
                          </span>
                        </p>
                      </div>
                      <div className="price_indiv d-flex justify-content-between">
                        <p>Shipping Charge</p>
                        <p>
                          Rs<span id="shipping_charge">{shippingCharge}</span>
                        </p>
                      </div>
                      <hr />
                      <div className="total-amt d-flex justify-content-between font-weight-bold">
                        <p>The total amount of (including VAT)</p>
                        <p>
                          Rs{" "}
                          <span id="product_total_amt">{totalCartAmt}</span>
                        </p>
                      </div>
                      <button
                        className="btn btn-primary text-uppercase"
                        onClick={checkout}
                      >
                        Checkout
                      </button>
                    </div>
                    <div className="discount_code mt-3 shadow">
                      <div className="card">
                        <div className="card-body">
                          <a
                            className="d-flex justify-content-between"
                            data-toggle="collapse"
                            href="#collapseExample"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                          >
                            Add a discount code (optional)
                            <span>
                              <i className="fas fa-chevron-down pt-1"></i>
                            </span>
                          </a>
                          <div className="collapse" id="collapseExample">
                            <div className="mt-3">
                              <input
                                type="text"
                                name=""
                                id="discount_code1"
                                className="form-control font-weight-bold"
                                placeholder="Enter the discount code"
                                onChange={(e) => setDiscountCode(e.target.value)}
                              />
                              <small id="error_trw" className="text-dark mt-3">
                                code is thapa
                              </small>
                            </div>
                            <button
                              className="btn btn-primary btn-sm mt-3"
                              onClick={applyDiscountCode}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 shadow p-3 bg-white">
                      <div className="pt-4">
                        <h5 className="mb-4">Expected delivery date</h5>
                        <p>July 27th 2020 - July 29th 2020</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
