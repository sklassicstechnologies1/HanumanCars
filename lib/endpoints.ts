import { axiosInstance } from "./axiosInstance";
import { useAuthStore } from "@/store/auth";
import { usePaymentStore } from "@/store/payment";

export const authAPI = {
  sendOTP: (email: string, action: "send_otp") => axiosInstance.post("/login", { email, action }),

  login: async (email: string, otp: string) => {
    const response = await axiosInstance.post("/login", { email, action: "login", otp });

    if (response.data.access_token) {
      useAuthStore.setState({ token: response.data.access_token });
    }

    return response;
  },

  getRole: () => axiosInstance.get("/role"),

  register: (data: { name: string; email: string; contact: string; action: string; otp?: string }) =>
    axiosInstance.post("/register", data),

  logout: () => axiosInstance.post("/logout"),
};

export const carAPI = {
  getLiveCars: () => axiosInstance.get("/home"),
  getCarDetails: (carId: number) => axiosInstance.get(`/booking/${carId}`),
  bookCar: (carId: number, data: { start_time: string; end_time: string }) => axiosInstance.post(`/booking/${carId}`, data),
  reserveCar: (carId: number, data: { start_time: string; end_time: string }) => axiosInstance.post(`/reserve/${carId}`, data),
  payFull: (carId: number, data: { start_time: string; end_time: string }) => axiosInstance.post(`/pay_full/${carId}`, data),
};

export const paymentAPI = {
  getPaymentDetails: (orderId: string) => axiosInstance.get(`/pay?order_id=${orderId}`),
  confirmPayment: async (data: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    const response = await axiosInstance.post("/payment_success", data);
    if (response.data) {
      usePaymentStore.setState({ payment: response?.data });
    }
  },
  payDue: (bookingId: number) => axiosInstance.post(`/pay_due/${bookingId}`),
  payDueNow: (orderId: string) => axiosInstance.get(`/pay_due_now?order_id=${orderId}`),
};

export const documentAPI = {
  uploadDocuments: (bookingId: number, formData: FormData) =>
    axiosInstance.post(`/upload_documents/${bookingId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getDocuments: (bookingId: number) => axiosInstance.get(`/upload_documents/${bookingId}`),
};

export const userAPI = {
  getUserDashboard: () => axiosInstance.get("/user_dashboard"),
  getLiveBookings: () => axiosInstance.get("/user/bookings/live"),
  getPastBookings: () => axiosInstance.get("/user/bookings/past"),
  getCancelledBookings: () => axiosInstance.get("/user/bookings/cancelled"),
  getRideStatus: (bookingId: number) => axiosInstance.get(`/user/ride_status/${bookingId}`),
};

export const adminAPI = {
  getApprovals: () => axiosInstance.get("/admin/approvals"),
  approveBooking: (bookingId: number) => axiosInstance.post(`/admin/approve/${bookingId}`),
  rejectBooking: (bookingId: number) => axiosInstance.post(`/admin/reject/${bookingId}`),
  getDashboard: () => axiosInstance.get("/admin/dashboard"),
  getBookings: () => axiosInstance.get("/admin/bookings"),
  getEarnings: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return axiosInstance.get(`/admin/earnings?${params}`);
  },
  addCar: (formData: FormData) =>
    axiosInstance.post("/admin/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  editCar: (carId: number, formData: FormData) =>
    axiosInstance.post(`/admin/edit/${carId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteCar: (carId: number) => axiosInstance.post(`/admin/delete/${carId}`),
  cancelBooking: (bookingId: number) => axiosInstance.post(`/admin/cancel_booking/${bookingId}`),
  getLiveRides: () => axiosInstance.get("/admin/live_rides"),
  forceEndRide: (bookingId: number) => axiosInstance.post(`/admin/force_end/${bookingId}`),
  getBlockManager: () => axiosInstance.get("/admin/block_manager"),
  getCarBlocks: (carId: number) => axiosInstance.get(`/admin/block/${carId}`),
  blockCar: (carId: number, data: { start_block: string; end_block: string }) =>
    axiosInstance.post(`/admin/block/${carId}`, data),
  unblockCar: (carId: number, blockIndex: number) => axiosInstance.post(`/admin/unblock/${carId}/${blockIndex}`),
};

export const ownerAPI = {
  getDashboard: () => axiosInstance.get("/owner/dashboard"),
  getEarnings: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    return axiosInstance.get(`/owner/earnings?${params}`);
  },
}; 