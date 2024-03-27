package main

import (
	"gorm.io/gorm"
)

type Image struct {
	gorm.Model
	ProductID uint
	Name      string
	Type      string
	Size      int64
}

type Product struct {
	gorm.Model
	UserID      uint   // Foreign key referencing User.ID
	Code        string `json:"code"`
	ProductName string `json:"productname"`
	Price       string `json:"price"`
	Stock       string `json:"stock"`
}

// ProductWithImages represents a product along with its images
type ProductWithImages struct {
    Product   Product `json:"product"`
    ImageUrls []string `json:"imageUrls"`
}
