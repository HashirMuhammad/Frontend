package main

import "gorm.io/gorm"

// CartItem represents an item in the cart.
type CartItem struct {
	gorm.Model
	CartDataID     uint   // Foreign key referencing CartData.ID
	ProductID      uint   `json:"id"` // Product ID
	Name           string `json:"name"`
	Price          string `json:"price"`
	Quantity       int    `json:"quantity"`
	Code           string `json:"code"`
	TotalItemPrice int    `json:"totalItemPrice"`
}

// CartData represents the overall cart data.
type CartData struct {
	gorm.Model
	UserID           uint       // Foreign key referencing User.ID
	Items            []CartItem `json:"items"`
	TotalQuantity    int        `json:"totalQuantity"`
	TotalPrice       int        `json:"totalPrice"`
	ClientID         uint        
	ClientName       string     `json:"clientName"`
	Date             string     `json:"date"`
	PaymentReceived  int        `json:"paymentReceived"`
	RemainingPayment int        `json:"remainingPayment"`
}

