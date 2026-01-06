package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"todo-go/models"
)

var DB *gorm.DB

func InitDatabase(databaseURL string) {
	var err error

	DB, err = gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	err = DB.AutoMigrate(&models.Todo{})
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	fmt.Println("✅ Database connected")
	// log.Println("Database connected and migrated successfully")
}

func GetDB() *gorm.DB {
	return DB
}
