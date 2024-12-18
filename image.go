package main

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func (a *App) GetScreenShotPaths() ([]string, error) {
	var paths []string

	walkFn := func(path string, info fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && info.Name() == "screenshot.png" {
			paths = append(paths, path)
		}
		return nil
	}

	if err := filepath.WalkDir(env.OutDir, walkFn); err != nil {
		log.Print(err)
		return nil, err
	}

	return paths, nil
}

func (a *App) SaveSSPath(path string) string {
	file, err := os.OpenFile(env.SaveFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0660)
	if err != nil {
		log.Fatalf("[ERROR] failed opening or creating file: %s", err)
	}
	defer file.Close()

	_, err = io.WriteString(file, path+"\n")
	if err != nil {
		log.Fatalf("[ERROR] failed writing to file: %s", err)
	}

	return env.SaveFile
}

func (a *App) DeletePhishData(path string) {
	path = strings.TrimSuffix(path, "/screenshot.png")
	dirName := filepath.Base(path)
	if env.TrashDir != "" {
		if err := os.CopyFS(fmt.Sprintf("%s/%s", env.TrashDir, dirName), os.DirFS(path)); err != nil {
			log.Printf("[ERROR] failed copying file: %s", err)
			return
		}
	}
	if err := os.RemoveAll(path); err != nil {
		log.Printf("[ERROR] failed opening or creating file: %s", err)
		return
	}
	fmt.Println("[INFO] Deleted: ", path)
}