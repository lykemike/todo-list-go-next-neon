package handlers

import (
	// "fmt"
	// "io"
	// "fmt"
	// "fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	"todo-go/database"
	"todo-go/models"
)

// GetTodos, retrives all todos from the database
func GetTodos(c echo.Context) error {
	var todos []models.Todo

	result := database.DB.Order("created_at desc").Find(&todos)
	if result.Error != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Todo fetched successfully",
		"todo":    todos,
	})
}

func CreateTodo(c echo.Context) error {
	var todo models.Todo
	if err := c.Bind(&todo); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	if err := database.DB.Create(&todo).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Todo created successfully",
		"todo":    todo,
	})
}

func UpdateTodo(c echo.Context) error {
	id := c.Param("id")
	var todo models.Todo

	if err := database.DB.First(&todo, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	var updateData models.Todo
	if err := c.Bind(&updateData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
	}

	todo.Title = updateData.Title
	todo.Completed = updateData.Completed

	if err := database.DB.Save(&todo).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Todo updated successfully",
		"todo":    todo,
	})
}

func DeleteTodo(c echo.Context) error {
	id := c.Param("id")
	var todo models.Todo

	if err := database.DB.First(&todo, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	if err := database.DB.Delete(&todo).Error; err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "Todo not found",
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Todo deleted successfully",
	})
}
