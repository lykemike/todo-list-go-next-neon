package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
	Port        string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file:", err)
	}

	dbURL := os.Getenv("DATABASE_URL")
	// log.Println("Database URL:", dbURL)
	if dbURL == "" {
		log.Fatal("❌ DATABASE_URL environment variable is required")
	}

	port := os.Getenv("PORT")
	// log.Println("Port:", port)
	if port == "" {
		port = "8080"
	}

	fmt.Println("✅ Configuration loaded")

	return &Config{
		DatabaseURL: dbURL,
		Port:        port,
	}
}
