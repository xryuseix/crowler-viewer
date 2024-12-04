package main

import (
	"io/fs"
	"log"
	"path/filepath"
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
