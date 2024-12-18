package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	OutDir   string
	SaveFile string
	TrashDir string
}

var env *Env

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	outDir := os.Getenv("OUT_DIR")
	if outDir == "" {
		log.Fatal("OUT_DIR is not set")
	}

	saveFile := os.Getenv("SAVE_FILE")
	if saveFile == "" {
		saveFile = "marked.txt"
	}

	env = &Env{OutDir: outDir, SaveFile: saveFile, TrashDir: os.Getenv("TRASH_DIR")}
}
