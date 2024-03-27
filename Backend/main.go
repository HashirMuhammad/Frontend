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
	r.HandleFunc("/clients/{id}", GetClientByIDHandler).Methods("GET")
	r.HandleFunc("/clients/{id}", UpdateClientHandler).Methods("PUT")
	r.HandleFunc("/clients/{id}", DeleteClientHandler).Methods("DELETE")

	r.HandleFunc("/upload/{productId}", uploadFile).Methods("POST")
	// r.HandleFunc("/getImage", getImage).Methods("GET")

	r.HandleFunc("/create_product", CreateProductHandler).Methods("POST")
	r.HandleFunc("/products", GetAllProductsHandler).Methods("GET")

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
