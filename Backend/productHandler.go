package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

// UploadImageHandler handles the image upload request
func uploadFile(w http.ResponseWriter, r *http.Request) {
	// Parse the multipart form containing the file
	err := r.ParseMultipartForm(10 << 20) // 10 MB maximum
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// Get the file from the form data
	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file from form data", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create a new file on the server to store the uploaded file
	dst, err := os.Create(handler.Filename)
	if err != nil {
		http.Error(w, "Error creating the file on server", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the file content from the uploaded file to the destination file
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Error copying file content", http.StatusInternalServerError)
		return
	}

	// Extract client ID from the URL parameters
	params := mux.Vars(r)
	productId, err := strconv.Atoi(params["productId"])
	if err != nil {
		http.Error(w, "Invalid productId ID", http.StatusBadRequest)
		return
	}

	// Create a new Image record
	image := &Image{
		Name: handler.Filename,
		Type: handler.Header.Get("Content-Type"),
		Size: handler.Size,
	}

	image.ProductID = uint(productId)

	// Save the Image record to the database
	err = CreateImageRecord(image)
	if err != nil {
		http.Error(w, "Error saving image record to database", http.StatusInternalServerError)
		return
	}

	// Return the ID of the newly created image in the response
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Image uploaded successfully. ID: %d", image.ID)
}

// CreateProductHandler handles the creation of a new product
func CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract JWT token from the request header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Authorization token missing", http.StatusUnauthorized)
		return
	}

	// Parse JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil // Use your JWT signing key here
	})
	if err != nil {
		http.Error(w, "Failed to parse token", http.StatusUnauthorized)
		return
	}

	// Extract user ID from the JWT claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID := uint(claims["user_id"].(float64)) // Assuming user ID is stored as uint in the claims

	// Set the UserID for the product (assuming UserID is obtained from the authentication token)
	// For demonstration purposes, let's assume the UserID is hardcoded

	var product Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	product.UserID = userID // Assuming UserID 1 is the authenticated user

	// Save the product to the database
	err = SaveProduct(&product)
	if err != nil {
		http.Error(w, "Failed to save product", http.StatusInternalServerError)
		return
	}

	// Respond with success message or product ID
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

// GetAllProductsHandler retrieves all products along with their images
func GetAllProductsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract JWT token from the request header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Authorization token missing", http.StatusUnauthorized)
		return
	}

	// Parse JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil // Use your JWT signing key here
	})
	if err != nil {
		http.Error(w, "Failed to parse token", http.StatusUnauthorized)
		return
	}

	// Extract user ID from the JWT claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID := uint(claims["user_id"].(float64)) // Assuming user ID is stored as uint in the claims

	// Retrieve the user from the database
	user, err := GetUserByID(userID)
	if err != nil {
		http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Fetch all products from the database
	// var products []Product
	// if err := Database.Find(&products).Error; err != nil {
	//     http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
	//     return
	// }

	// Fetch all products associated with the authenticated user from the database
	var products []Product
	if err := Database.Where("user_id = ?", userID).Find(&products).Error; err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	// Create a slice to store products with their images
	var productsWithImages []map[string]interface{}

	// Iterate over each product
	for _, product := range products {
		// Fetch all images associated with the current product
		var images []Image
		if err := Database.Where("product_id = ?", product.ID).Find(&images).Error; err != nil {
			http.Error(w, "Failed to fetch images for product", http.StatusInternalServerError)
			return
		}

		// Create a slice to store image data
		var imageDatas [][]byte

		// Read and store image data for each image
		for _, image := range images {
			// Read the image file from the server
			file, err := os.Open(image.Name)
			if err != nil {
				http.Error(w, "Error reading image file", http.StatusInternalServerError)
				return
			}
			defer file.Close()

			// Read image data
			imageData, err := ioutil.ReadAll(file)
			if err != nil {
				http.Error(w, "Error reading image data", http.StatusInternalServerError)
				return
			}

			// Append image data to the slice
			imageDatas = append(imageDatas, imageData)
		}

		// Construct response for the current product with its images
		productWithImages := map[string]interface{}{
			"product": product,
			"images":  imageDatas,
		}

		// Append to the slice of products with images
		productsWithImages = append(productsWithImages, productWithImages)
	}

	// Respond with the products along with their images
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(productsWithImages)
}

// UpdateStockHandler updates the stock of a product
func UpdateStockHandler(w http.ResponseWriter, r *http.Request) {
	// Extract product ID from URL parameter
	params := mux.Vars(r)
	productID, err := strconv.Atoi(params["product_id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	// Retrieve product from the database
	var product Product
	if err := Database.First(&product, productID).Error; err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// Check if the product belongs to the authenticated user
	if product.UserID != userIDFromJWTToken(r) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse request body to extract new stock value
	var requestData struct {
		NewStock string `json:"stock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Update the stock of the product
	product.Stock = requestData.NewStock
	if err := Database.Save(&product).Error; err != nil {
		http.Error(w, "Failed to update stock", http.StatusInternalServerError)
		return
	}

	// Return the updated product
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract JWT token from the request header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Authorization token missing", http.StatusUnauthorized)
		return
	}

	// Parse JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil // Use your JWT signing key here
	})
	if err != nil {
		http.Error(w, "Failed to parse token", http.StatusUnauthorized)
		return
	}

	// Extract user ID from the JWT claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID := uint(claims["user_id"].(float64)) // Assuming user ID is stored as uint in the claims

	// Extract ProductID from the URL parameters
	params := mux.Vars(r)
	productID, err := strconv.Atoi(params["productID"])
	if err != nil {
		http.Error(w, "Invalid ProductID", http.StatusBadRequest)
		return
	}

	// Check if the user is authorized to update the product
	if !IsAuthorizedToUpdateProduct(userID, productID) {
		http.Error(w, "Unauthorized to update product", http.StatusForbidden)
		return
	}

	// Decode the request body into a Product struct
	var updatedProduct Product
	if err := json.NewDecoder(r.Body).Decode(&updatedProduct); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update the product in the database
	err = UpdateProduct(productID, &updatedProduct)
	if err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
		return
	}

	// Respond with success message or updated product
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedProduct)
}

// DeleteProductHandler deletes a product by its ID
func DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	// Parse product ID from the URL parameters
	vars := mux.Vars(r)
	productID, err := strconv.Atoi(vars["product_id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	UserID := userIDFromJWTToken(r)

	// Delete the product from the database
	if err := DeleteProduct(productID, UserID); err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete product: %v", err), http.StatusInternalServerError)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Product with ID %d has been deleted successfully", productID)
}

func GetProductsByStockHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // Extract JWT token from the request header
    tokenString := r.Header.Get("Authorization")
    if tokenString == "" {
        http.Error(w, "Authorization token missing", http.StatusUnauthorized)
        return
    }

    // Parse JWT token
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil // Use your JWT signing key here
    })
    if err != nil {
        http.Error(w, "Failed to parse token", http.StatusUnauthorized)
        return
    }

    // Extract user ID from the JWT claims
    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok || !token.Valid {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }
    userID := uint(claims["user_id"].(float64)) // Assuming user ID is stored as uint in the claims

    // Retrieve the user from the database
    user, err := GetUserByID(userID)
    if err != nil {
        http.Error(w, "Failed to retrieve user", http.StatusInternalServerError)
        return
    }
    if user == nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Fetch products with zero stock associated with the authenticated user from the database
    var products []Product
    if err := Database.Where("user_id = ? AND stock = 0", userID).Find(&products).Error; err != nil {
        http.Error(w, "Failed to fetch products with zero stock", http.StatusInternalServerError)
        return
    }

    // Create a slice to store products with their images
    var productsWithImages []map[string]interface{}

    // Iterate over each product
    for _, product := range products {
        // Fetch all images associated with the current product
        var images []Image
        if err := Database.Where("product_id = ?", product.ID).Find(&images).Error; err != nil {
            http.Error(w, "Failed to fetch images for product", http.StatusInternalServerError)
            return
        }

        // Create a slice to store image data
        var imageDatas [][]byte

        // Read and store image data for each image
        for _, image := range images {
            // Read the image file from the server
            file, err := os.Open(image.Name)
            if err != nil {
                http.Error(w, "Error reading image file", http.StatusInternalServerError)
                return
            }
            defer file.Close()

            // Read image data
            imageData, err := ioutil.ReadAll(file)
            if err != nil {
                http.Error(w, "Error reading image data", http.StatusInternalServerError)
                return
            }

            // Append image data to the slice
            imageDatas = append(imageDatas, imageData)
        }

        // Construct response for the current product with its images
        productWithImages := map[string]interface{}{
            "product": product,
            "images":  imageDatas,
        }

        // Append to the slice of products with images
        productsWithImages = append(productsWithImages, productWithImages)
    }

    // Respond with the products along with their images
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(productsWithImages)
}


// Function to extract user ID from JWT token
func userIDFromJWTToken(r *http.Request) uint {
	// Extract JWT token from the request header
	tokenString := r.Header.Get("Authorization")

	// Parse JWT token
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil // Use your JWT signing key here
	})

	// Extract user ID from the JWT claims
	claims, _ := token.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64)) // Assuming user ID is stored as uint in the claims
	return userID
}
