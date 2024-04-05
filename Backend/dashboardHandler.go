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

	// days.day_name AS day,
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
            STR_TO_DATE(created_at, '%Y-%m-%d') AS date_formatted,
            payment_received
        FROM 
            posterminal.cart_data d
        WHERE 
            CASE 
                WHEN DAYOFWEEK(NOW()) = 2 THEN
                    DATE(created_at) = CURDATE()
                ELSE
                    DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) 
                    AND DATE(created_at) <= CURDATE()
            END
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

	// months.month_name AS month,

	// Execute the SQL query
	rows, err := Database.Raw(`
	SELECT 
    COALESCE(SUM(cd.payment_received), 0) AS total_payment_received
FROM 
    (
        SELECT 1 AS month_number, 'January' AS month_name
        UNION SELECT 2, 'February'
        UNION SELECT 3, 'March'
        UNION SELECT 4, 'April'
        UNION SELECT 5, 'May'
        UNION SELECT 6, 'June'
        UNION SELECT 7, 'July'
        UNION SELECT 8, 'August'
        UNION SELECT 9, 'September'
        UNION SELECT 10, 'October'
        UNION SELECT 11, 'November'
        UNION SELECT 12, 'December'
    ) AS months
LEFT JOIN 
    (
        SELECT 
            MONTH(created_at) AS month_number,
            payment_received
        FROM 
            posterminal.cart_data d
        WHERE 
            YEAR(created_at) = YEAR(CURDATE()) AND user_id = ?
    ) AS cd ON months.month_number = cd.month_number
GROUP BY 
    months.month_number, months.month_name
ORDER BY 
    months.month_number;

    `, userID).Rows()
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

// Struct to represent the response
type CartDataResponse struct {
	TotalQuantity         int `json:"total_quantity"`
	TotalPrice            int `json:"total_price"`
	TotalPaymentReceived  int `json:"total_payment_received"`
	TotalRemainingPayment int `json:"total_remaining_payment"`
}

func handleCartData(w http.ResponseWriter, r *http.Request) {
    // Extract user ID from token or wherever it's stored
    userID := userIDFromJWTToken(r)

    // Execute the SQL query
    var totalQuantity, totalPrice, totalPaymentReceived, totalRemainingPayment int
    // Execute the SQL query
    rows, err := Database.Raw(`
        SELECT 
            COALESCE(SUM(total_quantity), 0) AS total_quantity,
            COALESCE(SUM(total_price), 0) AS total_price,
            COALESCE(SUM(payment_received), 0) AS total_payment_received,
            COALESCE(SUM(remaining_payment), 0) AS total_remaining_payment
        FROM 
            posterminal.cart_data
        WHERE 
            user_id = ? AND DATE(created_at) = CURDATE()
    `, userID).Rows()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    // Scan the result into variables
    for rows.Next() {
        if err := rows.Scan(&totalQuantity, &totalPrice, &totalPaymentReceived, &totalRemainingPayment); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
    }

    // Create response
    responseData := []CartDataResponse{{
        TotalQuantity:         totalQuantity,
        TotalPrice:            totalPrice,
        TotalPaymentReceived:  totalPaymentReceived,
        TotalRemainingPayment: totalRemainingPayment,
    }}

    // Convert response data to JSON
    jsonResponse, err := json.Marshal(responseData)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Set response headers and write JSON response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonResponse)
}


type TotalsResponse struct {
    TotalRecords         int `json:"total_records"`
    TotalRemainingPayment int `json:"total_remaining_payment"`
}

// Handler for /combined-totals endpoint
func combinedTotalsHandler(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromJWTToken(r)
    // Execute the SQL query
    var totalRecords, totalRemainingPayment int
    rows, err := Database.Raw(`
        SELECT 
            (SELECT COUNT(*) FROM posterminal.cart_data WHERE user_id = ? AND DATE(created_at) = CURDATE()) AS total_records,
            (SELECT SUM(remaining_payment) FROM posterminal.cart_data WHERE user_id = ?) AS total_remaining_payment
    `, userID, userID).Rows()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    // Scan the result into variables
    for rows.Next() {
        if err := rows.Scan(&totalRecords, &totalRemainingPayment); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
    }

    // Create response as a slice containing a single object
    response := []TotalsResponse{{
        TotalRecords:         totalRecords,
        TotalRemainingPayment: totalRemainingPayment,
    }}

    // Convert response to JSON
    jsonResponse, err := json.Marshal(response)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Set response headers and write JSON response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonResponse)
}
