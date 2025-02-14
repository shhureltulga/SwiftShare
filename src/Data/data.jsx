import api from "axios";
const URL = "http://localhost:3010/api"
console.log(URL)
// Дата авах
export const fetchData = async (empid) => {
  try {
    const response = await api.get(`${URL}/test/empid/${empid}`);
    console.log(response.data.result)
    return response.data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};   

export const createItem = async (itemData) => {
  try {
    const response = await api.post(`${URL}/test/uploads`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const updateItem = async (id, updateData) => {
  try {
    const response = await api.put(`${URL}/test${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
export const updateStatus = async (id, updateData) => {
    try {
      const response = await api.patch(`${URL}/test/${id}/status`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`${URL}/test${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};