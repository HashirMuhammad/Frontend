package main

import (
	"net/http"

	"github.com/rs/cors"

	"github.com/gorilla/mux"
)

func main() {
	DataMigration()
	r := mux.NewRouter()
	r.HandleFunc("/signup", Signup).Methods("POST")
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/save-client", CreateClientHandler).Methods("POST")
	r.HandleFunc("/clients", GetClientsHandler).Methods("GET")
	r.HandleFunc("/clients-id-name", GetClientsNameIDHandler).Methods("GET")
	r.HandleFunc("/clients/{id}", GetClientByIDHandler).Methods("GET")
	r.HandleFunc("/clients/{id}", UpdateClientHandler).Methods("PUT")
	r.HandleFunc("/clients/{id}", DeleteClientHandler).Methods("DELETE")
	r.HandleFunc("/upload/{productId}", uploadFile).Methods("POST")
	// r.HandleFunc("/getImage", getImage).Methods("GET")
	r.HandleFunc("/create_product", CreateProductHandler).Methods("POST")
	r.HandleFunc("/products", GetAllProductsHandler).Methods("GET")
	r.HandleFunc("/productForTable", GetProductsForUserHandler).Methods("GET")
	r.HandleFunc("/products/zero-stock", GetProductsByStockHandler).Methods("GET")
	r.HandleFunc("/products/{product_id}/stock", UpdateStockHandler).Methods("PUT")
	r.HandleFunc("/products/{productID}", UpdateProductHandler).Methods("PUT")
	r.HandleFunc("/products/{product_id}", DeleteProductHandler).Methods("DELETE")
	r.HandleFunc("/save-cart", SaveCartDataHandler).Methods("POST")
	r.HandleFunc("/get-cart", GetAllCartDataHandler).Methods("GET")
	r.HandleFunc("/get-cart-items/{cartDataID}", GetCartDataWithItemsHandler).Methods("GET")
	r.HandleFunc("/cart/{cartDataID}", DeleteCartDataWithItemsHandler).Methods("DELETE")
	r.HandleFunc("/get-all-clients", GetAllCartDataForUserHandler).Methods("GET")
	r.HandleFunc("/get-remaining-payment-clients", GetRemainingPaymentOfClientsUnique).Methods("GET")
	r.HandleFunc("/daily-sales", GetCartData).Methods("GET")
	r.HandleFunc("/monthly-sales", GetTotalPaymentReceivedByMonth).Methods("GET")

	// Create a file server instance to serve files from the "static" directory
	fs := http.FileServer(http.Dir("static"))

	// Serve files from the "/static/" route
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:4200"}, // Update this with your Angular app's URL
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Attach the CORS middleware to your router
	http.ListenAndServe(":8080", corsHandler.Handler(r))
}
