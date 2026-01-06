package main

import (
	"fmt"
	"io"

	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"todo-go/config"
	"todo-go/database"
	"todo-go/handlers"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	database.InitDatabase(cfg.DatabaseURL)

	// Create Echo instance
	e := echo.New()
	e.HideBanner = true
	e.Logger.SetOutput(io.Discard)

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			start := time.Now()
			err := next(c)

			// Color codes
			statusColor := "\033[32m" // Green
			if c.Response().Status >= 400 {
				statusColor = "\033[31m" // Red
			}
			reset := "\033[0m"

			fmt.Printf("%s[%d]%s %s %s (%v)\n",
				statusColor,
				c.Response().Status,
				reset,
				c.Request().Method,
				c.Request().RequestURI,
				time.Since(start).Round(time.Millisecond),
			)

			return err
		}
	})
	e.Use(middleware.Recover())
	// Middleware
	// e.Use(middleware.Logger())
	// e.Use(middleware.Recover())

	// CORS Middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	// Routes
	e.GET("/todos", handlers.GetTodos)
	e.POST("/todos", handlers.CreateTodo)
	e.PUT("/todos/:id", handlers.UpdateTodo)
	e.DELETE("/todos/:id", handlers.DeleteTodo)

	// Start server
	fmt.Printf("🚀 Server started on port %s\n", cfg.Port)
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}
