package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	DatabaseURL string
	Port        string
}

func LoadConfig() *Config {
	// Load .env file if it exists (for local development)
	// In production (Railway), environment variables are provided directly
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  No .env file found (this is normal in production)")
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
