package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// CartDataDashboard represents the structure of cart data
type CartDataDashboard struct {
	TotalPaymentReceived int `json:"totalPaymentReceived"`
}

// Handler for the endpoint
func GetCartData(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from token or wherever it's stored
	userID := userIDFromJWTToken(r)

	// Fetch data for the current week
	currentWeekData, err := getCurrentWeekTotalRecievedPayments(int(userID))
	if err != nil {
		handleError(w, err)
		return
	}

	// Marshal the currentWeekData into JSON format
	jsonData, err := json.Marshal(currentWeekData)
	if err != nil {
		handleError(w, err)
		return
	}

	// Write the JSON response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
// Function to fetch total remaining payments for the current week
func getCurrentWeekTotalRecievedPayments(userID int) ([]int, error) {
	// Execute the SQL query for the current week
	rows, err := Database.Raw(`
	SELECT 
    COALESCE(SUM(cd.payment_received), 0) AS total_payment_received
FROM 
    (
        SELECT 'Sunday' AS day_name
        UNION SELECT 'Monday'
        UNION SELECT 'Tuesday'
        UNION SELECT 'Wednesday'
        UNION SELECT 'Thursday'
        UNION SELECT 'Friday'
        UNION SELECT 'Saturday'
    ) AS days
LEFT JOIN 
    (
        SELECT 
            STR_TO_DATE(date, '%d/%m/%Y') AS date_formatted,
            payment_received
        FROM 
            posterminal.cart_data
        WHERE 
            STR_TO_DATE(date, '%d/%m/%Y') BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
            AND user_id = ?
    ) AS cd ON DAYNAME(cd.date_formatted) = days.day_name
GROUP BY 
    days.day_name
ORDER BY 
    FIELD(days.day_name, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

	`, userID).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to store the total remaining payments
	var totalReceivedPayments []int

	// Iterate through the rows and populate the slice
	for rows.Next() {
		var totalPaymentReceived int
		err := rows.Scan(&totalPaymentReceived)
		if err != nil {
			return nil, err
		}
		totalReceivedPayments = append(totalReceivedPayments, totalPaymentReceived)
	}

	return totalReceivedPayments, nil
}

// Function to handle errors
func handleError(w http.ResponseWriter, err error) {
	fmt.Println("Error:", err)
	http.Error(w, "Internal server error", http.StatusInternalServerError)
}

// GetTotalPaymentReceivedByMonth retrieves total payment received by month
func GetTotalPaymentReceivedByMonth(w http.ResponseWriter, r *http.Request) {
// Extract user ID from token or wherever it's stored
userID := userIDFromJWTToken(r)

    // Execute the SQL query
    rows, err := Database.Raw(`
	SELECT 
    COALESCE(SUM(cd.payment_received), 0) AS total_payment_received
FROM 
    (
        SELECT 1 AS month_number
        UNION SELECT 2
        UNION SELECT 3
        UNION SELECT 4
        UNION SELECT 5
        UNION SELECT 6
        UNION SELECT 7
        UNION SELECT 8
        UNION SELECT 9
        UNION SELECT 10
        UNION SELECT 11
        UNION SELECT 12
    ) AS months
LEFT JOIN 
    (
        SELECT 
            MONTH(created_at) AS month,
            payment_received
        FROM 
            posterminal.cart_data
        WHERE 
            MONTH(created_at) BETWEEN MONTH(DATE_SUB(CURDATE(), INTERVAL 12 MONTH)) AND MONTH(CURDATE())
            AND YEAR(created_at) = YEAR(CURDATE())
            AND user_id = ?
    ) AS cd ON months.month_number = cd.month
GROUP BY 
    months.month_number
ORDER BY 
    months.month_number;
    `,userID).Rows()
	if err != nil {
		return
	}
	
	defer rows.Close()
    // Extract total payment received by month
    var totalPayments []int
    for rows.Next() {
        var totalPayment int
        err := rows.Scan(&totalPayment)
        if err != nil {
            handleError(w, err)
            return
        }
        totalPayments = append(totalPayments, totalPayment)
    }

    // Marshal the totalPayments into JSON format
    jsonData, err := json.Marshal(totalPayments)
    if err != nil {
        handleError(w, err)
        return
    }

    // Write the JSON response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonData)
}

