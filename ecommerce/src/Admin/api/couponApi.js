import axios from "axios";

const API_URL = "http://localhost:5000/api/coupons";

// Create a new coupon
export const createCoupon = async (couponData) => {
    return axios.post(API_URL, couponData);
};

// Get all coupons
export const getCoupons = async () => {
    return axios.get(API_URL);
};

// Update a coupon
export const updateCoupon = async (id, couponData) => {
    return axios.put(`${API_URL}/${id}`, couponData);
};

// Delete a coupon
export const deleteCoupon = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// Validate a coupon
export const validateCoupon = async (code) => {
    return axios.post(`${API_URL}/validate`, { code });
};
