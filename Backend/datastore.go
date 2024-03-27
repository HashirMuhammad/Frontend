package main

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Database *gorm.DB

var urlDSN = "root:root@tcp(127.0.0.1:3306)/posterminal?parseTime=true"

var err error

func DataMigration() {

	Database, err = gorm.Open(mysql.Open(urlDSN), &gorm.Config{})
	if err != nil {
		fmt.Println(err.Error())
		panic("Connection Failed")
	}
	Database.AutoMigrate(&User{})
	Database.AutoMigrate(&Client{})
	Database.AutoMigrate(&Product{})
	Database.AutoMigrate(&Image{})

}

// USER
// GetUserByEmail retrieves a user from the database by email
func GetUserByEmail(email string) (*User, error) {
	var user User
	if err := Database.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // User not found
		}
		return nil, err // Other errors
	}
	return &user, nil
}

// CreateUser creates a new user in the database
func CreateUser(user *User) error {
	if err := Database.Create(user).Error; err != nil {
		return err
	}
	return nil
}

// GetUserByID retrieves a user from the database by ID
func GetUserByID(userID uint) (*User, error) {
	var user User
	if err := Database.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // User not found
		}
		return nil, err // Other errors
	}
	return &user, nil
}

// CLIENT
// CreateClient creates a new client associated with a user in the database
func CreateClient(user *User, client *Client) error {
	// Assign the user's ID to the client's UserID field
	client.UserID = user.ID

	// Save the client to the database
	if err := Database.Create(client).Error; err != nil {
		return err
	}
	return nil
}

func GetClientsByUserID(userID uint) ([]Client, error) {
	var clients []Client
	if err := Database.Where("user_id = ?", userID).Find(&clients).Error; err != nil {
		return nil, err
	}
	return clients, nil
}

// GetClientByID retrieves a client from the database by ID
func GetClientByID(clientID int) (*Client, error) {
	var client Client
	if err := Database.First(&client, clientID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Client not found
		}
		return nil, err // Other errors
	}
	return &client, nil
}

func DeleteClientByID(clientID int) error {
	// Delete the client by ID from the database
	if err := Database.Where("id = ?", clientID).Delete(&Client{}).Error; err != nil {
		return err
	}
	return nil
}

// PRODUCT
func CreateImageRecord(image *Image) error {
	// Insert the image record into the database
	if err := Database.Create(image).Error; err != nil {
		return err
	}
	return nil
}

// SaveProduct saves the product to the database with the provided UserID
// SaveProduct saves the product to the database
func SaveProduct(product *Product) error {
	
	// Save the product to the database
	if err := Database.Create(product).Error; err != nil {
		return err
	}

	return nil
}

// Define a function to get images by product ID
func getImagesByProductID(productID uint) ([]Image, error) {
    var images []Image
    if err := Database.Where("product_id = ?", productID).Find(&images).Error; err != nil {
        return nil, err
    }
    return images, nil
}