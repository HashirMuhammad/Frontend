package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// SaveCartDataHandler saves cart data to the database and deducts product stock.
// SaveCartDataHandler saves cart data to the database and deducts product stock.
func SaveCartDataHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // Get user ID from JWT token
    userID := userIDFromJWTToken(r)

    // Decode the request body into a CartData struct
    var cartData CartData
    if err := json.NewDecoder(r.Body).Decode(&cartData); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Associate the user ID with the cart data
    cartData.UserID = userID

    // Save the cart data to the database
    if err := SaveCartData(&cartData); err != nil {
        http.Error(w, "Failed to save cart data", http.StatusInternalServerError)
        return
    }

   // Deduct product stock
   for _, item := range cartData.Items {
	// Get the product from the database using item.ID
	product, err := GetProductByID(item.ProductID)
	if err != nil {
		// Log the error for debugging
		fmt.Println("Error getting product:", err)
		http.Error(w, "Failed to get product", http.StatusInternalServerError)
		return
	}
	
	// Check if product exists
	if product == nil {
		// Log the error for debugging
		fmt.Println("Product not found for ID:", item.ID)
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// Convert product stock to an integer
	stock, err := strconv.Atoi(product.Stock)
	if err != nil {
		// Log the error for debugging
		fmt.Println("Error converting product stock to integer:", err)
		http.Error(w, "Failed to convert product stock to integer", http.StatusInternalServerError)
		return
	}

	// Check if product has enough stock
	if stock >= item.Quantity {
		// Deduct stock
		stock -= item.Quantity

		// Update the product's stock in the database
		if err := UpdateProductStockByID(product.ID, stock); err != nil {
			// Log the error for debugging
			fmt.Println("Error updating product stock:", err)
			http.Error(w, "Failed to update product stock", http.StatusInternalServerError)
			return
		}
	} else {
		http.Error(w, "Product stock is insufficient", http.StatusBadRequest)
		return
	}
}

    // Respond with a success message
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(cartData)
}


// GetAllCartDataHandler retrieves all cart data of a specific user.
func GetAllCartDataHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // Get user ID from JWT token
    userID := userIDFromJWTToken(r)

    // Query the database to retrieve all cart data associated with the user ID
    cartDataList, err := GetAllCartDataByUserID(userID)
    if err != nil {
        http.Error(w, "Failed to retrieve cart data", http.StatusInternalServerError)
        return
    }

    // Serialize the retrieved cart data into JSON format
    jsonData, err := json.Marshal(cartDataList)
    if err != nil {
        http.Error(w, "Failed to serialize cart data", http.StatusInternalServerError)
        return
    }

    // Return the JSON response containing the cart data
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}


// GetCartDataWithItemsHandler retrieves cart data with its cart items by CartDataID.
func GetCartDataWithItemsHandler(w http.ResponseWriter, r *http.Request) {
    // Set the Content-Type header of the response to application/json
    w.Header().Set("Content-Type", "application/json")

    // Extract the CartDataID from the request URL parameters
    params := mux.Vars(r)
    cartDataIDParam, err := strconv.Atoi(params["cartDataID"])
    if err != nil {
        http.Error(w, "Invalid cartDataID ID", http.StatusBadRequest)
        return
    }

    // Query the database to fetch cart data with its cart items by CartDataID
    var cartData []CartData
    if err := Database.Preload("Items").Find(&cartData, "id = ?", cartDataIDParam).Error; err != nil {
        http.Error(w, "Failed to fetch cart data", http.StatusInternalServerError)
        return
    }

    // Marshal the cart data into JSON format
    jsonData, err := json.Marshal(cartData)
    if err != nil {
        http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
        return
    }

    // Write the JSON response
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}

// DeleteCartDataWithItemsHandler deletes cart data and its cart items by ID.
// DeleteCartDataWithItemsHandler deletes cart data and its cart items by CartDataID.
func DeleteCartDataWithItemsHandler(w http.ResponseWriter, r *http.Request) {
    // Set the Content-Type header of the response to application/json
    w.Header().Set("Content-Type", "application/json")

    // Extract the CartDataID from the request URL parameters
    params := mux.Vars(r)
    cartDataIDParam, err := strconv.Atoi(params["cartDataID"])
    if err != nil {
        http.Error(w, "Invalid cartDataID ID", http.StatusBadRequest)
        return
    }

    // Extract the user ID from the token
    userID := userIDFromJWTToken(r)

    // Check if the cart data exists for the provided user ID and CartDataID
    var cartData CartData
    if err := Database.Where("user_id = ? AND id = ?", userID, cartDataIDParam).First(&cartData).Error; err != nil {
        http.Error(w, "Cart data not found", http.StatusNotFound)
        return
    }

    // Delete the cart items associated with the cart data
    if err := Database.Where("cart_data_id = ?", cartDataIDParam).Delete(&CartItem{}).Error; err != nil {
        http.Error(w, "Failed to delete cart items", http.StatusInternalServerError)
        return
    }

    // Delete the cart data
    if err := Database.Delete(&cartData).Error; err != nil {
        http.Error(w, "Failed to delete cart data", http.StatusInternalServerError)
        return
    }

    // Respond with success message
    w.WriteHeader(http.StatusOK)
    response := map[string]string{"message": "Cart data and its cart items deleted successfully"}
    jsonResponse, _ := json.Marshal(response)
    w.Write(jsonResponse)
}

