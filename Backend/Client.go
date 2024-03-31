package main

import "gorm.io/gorm"

type Client struct {
	gorm.Model
	UserID        uint   // Foreign key referencing User.ID
	Name          string `json:"name"`
	EmailAddress  string `json:"emailaddress"`
	PhoneNo       string `json:"phoneno"`
	Country       string `json:"country"`
	City          string `json:"city"`
	BussniessName string `json:"bussniessname"`
	Description   string `json:"description"`
}


// ClientData represents the data structure for sending client ID and name.
type ClientData struct {
    ID   uint   `json:"id"`
    Name string `json:"name"`
}