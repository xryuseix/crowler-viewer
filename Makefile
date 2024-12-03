default: build-wails

TOOLS = github.com/wailsapp/wails/v2/cmd/wails@latest

$(TOOLS):
	go install $(TOOLS)

dev: $(TOOLS)
	wails dev
build-wails: $(TOOLS)
	wails build
run:
	open build/bin/crowler-viewer.app
fmt:
	go fmt ./...