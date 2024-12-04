package main

import (
	"github.com/wailsapp/wails/v2/pkg/logger"
)

func (a *App) Logging(log string) {
	logInstance := logger.NewDefaultLogger()
	logInstance.Print(log)
}
