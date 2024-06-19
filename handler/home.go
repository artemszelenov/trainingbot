package handler

import (
	"trainingbot/tgview"

	"github.com/labstack/echo/v5"
)

func HandleHomeSHow(c echo.Context) error {
	return render(c, tgview.ShowHome("Margo!"))
}