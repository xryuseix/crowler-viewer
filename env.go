package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Env struct {
	OutDir string
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
	fmt.Println("OUT_DIR: ", outDir)

	env = &Env{OutDir: outDir}
}
