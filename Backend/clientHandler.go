package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

// CreateClientHandler handles requests to create a new client associated with the user
func CreateClientHandler(w http.ResponseWriter, r *http.Request) {
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

	// Decode client data from request body
	var client Client
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Associate the client with the user
	client.UserID = userID

	// Save the client to the database
	if err := CreateClient(user, &client); err != nil {
		http.Error(w, "Failed to create client", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(client)
}

// GetClientsHandler handles requests to retrieve clients associated with the user
func GetClientsHandler(w http.ResponseWriter, r *http.Request) {
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

	// Retrieve the clients associated with the user from the database
	clients, err := GetClientsByUserID(userID)
	if err != nil {
		http.Error(w, "Failed to retrieve clients", http.StatusInternalServerError)
		return
	}

	// Return the list of clients in the response
	json.NewEncoder(w).Encode(clients)
}

// GetClientByIDHandler retrieves a client by ID from the database
func GetClientByIDHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract client ID from the URL parameters
	params := mux.Vars(r)
	clientID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid client ID", http.StatusBadRequest)
		return
	}

	// Retrieve the client from the database
	client, err := GetClientByID(clientID)
	if err != nil {
		http.Error(w, "Failed to retrieve client", http.StatusInternalServerError)
		return
	}
	if client == nil {
		http.Error(w, "Client not found", http.StatusNotFound)
		return
	}

	// Return the client in the response
	json.NewEncoder(w).Encode(client)
}

// UpdateClientHandler updates a client's record in the database
func UpdateClientHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract client ID from the URL parameters
	params := mux.Vars(r)
	clientID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid client ID", http.StatusBadRequest)
		return
	}

	// Retrieve the client from the database
	client, err := GetClientByID(clientID)
	if err != nil {
		http.Error(w, "Failed to retrieve client", http.StatusInternalServerError)
		return
	}
	if client == nil {
		http.Error(w, "Client not found", http.StatusNotFound)
		return
	}

	// Decode the updated client data from the request body
	var updatedClient Client
	if err := json.NewDecoder(r.Body).Decode(&updatedClient); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	// Update the client's record in the database
	client.Name = updatedClient.Name
	client.EmailAddress = updatedClient.EmailAddress
	client.PhoneNo = updatedClient.PhoneNo
	client.Country = updatedClient.Country
	client.City = updatedClient.City
	client.BussniessName = updatedClient.BussniessName
	client.Description = updatedClient.Description

	// Save the updated client to the database
	if err := Database.Save(&client).Error; err != nil {
		http.Error(w, "Failed to update client", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(client)
}

func DeleteClientHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract client ID from the URL parameters
	params := mux.Vars(r)
	clientID, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid client ID", http.StatusBadRequest)
		return
	}

	// Implement logic to delete the client with the given ID from the database
	err = DeleteClientByID(clientID)
	if err != nil {
		http.Error(w, "Failed to delete client", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Client deleted successfully"})
}

// GetClientsHandler returns the ID and name of clients for the user whose ID is in the JWT token.
func GetClientsNameIDHandler(w http.ResponseWriter, r *http.Request) {
    // Set the Content-Type header of the response to application/json
    w.Header().Set("Content-Type", "application/json")

    // Get user ID from JWT token
    userID := userIDFromJWTToken(r)

    // Query the database to fetch client IDs and names associated with the user
    var clients []Client
    if err := Database.Where("user_id = ?", userID).Find(&clients).Error; err != nil {
        http.Error(w, "Failed to fetch clients", http.StatusInternalServerError)
        return
    }

    // Create a slice to store client data (ID and name)
    var clientDataList []ClientData
    for _, client := range clients {
        clientData := ClientData{
            ID:   client.ID,
            Name: client.Name,
        }
        clientDataList = append(clientDataList, clientData)
    }

    // Marshal the client data slice into JSON format
    jsonData, err := json.Marshal(clientDataList)
    if err != nil {
        http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
        return
    }

    // Write the JSON response
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}