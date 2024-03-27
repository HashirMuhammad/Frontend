package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
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
    // Fetch all products from the database
    var products []Product
    if err := Database.Find(&products).Error; err != nil {
        http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
        return
    }

    // Create a slice to store products with images
    var productsWithImages []map[string]interface{}

    // Iterate over each product to fetch its associated image
    for _, product := range products {
        var image Image
        if err := Database.Where("product_id = ?", product.ID).First(&image).Error; err != nil {
            if errors.Is(err, gorm.ErrRecordNotFound) {
                // If no image found for the product, continue to the next product
                continue
            }
            http.Error(w, "Failed to fetch image for product", http.StatusInternalServerError)
            return
        }

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

        // Construct response for product with image
        productWithImage := map[string]interface{}{
            "product": product,
            "image":   imageData,
        }

        // Append to the slice
        productsWithImages = append(productsWithImages, productWithImage)
    }

    // Respond with the products along with their images
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(productsWithImages)
}
